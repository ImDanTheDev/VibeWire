use std::{
    collections::{HashMap, HashSet},
    fmt::Display,
    ops::{Add, AddAssign},
    sync::{Arc, Mutex},
    time::SystemTime,
};

use convex::ConvexClient;
use tokio::{
    sync::{broadcast, mpsc::UnboundedSender},
    time::Instant,
};

use crate::{ChannelId, ServerId, ServerMessage, UserId};

type ClientTx = UnboundedSender<ServerMessage>;
type BroadcastTx = broadcast::Sender<ServerMessage>;

pub struct AppState {
    next_connection_id: Arc<Mutex<ConnectionId>>,
    pub convex: ConvexClient,
    pub connections: Arc<Mutex<HashMap<ConnectionId, ConnectionInfo>>>,
    pub users: Arc<Mutex<HashMap<UserId, UserInfo>>>,
    pub broadcast_tx: BroadcastTx,
    pub server_subscriptions: Arc<Mutex<HashMap<ServerId, HashSet<ConnectionId>>>>,
    pub typing: Arc<Mutex<HashMap<(ServerId, ChannelId), HashMap<UserId, Instant>>>>,
}

pub struct ConnectionInfo {
    pub tx: ClientTx,
    pub user_id: UserId,
    pub subscription: Option<Subscription>,
}

pub struct UserInfo {
    connections: HashSet<ConnectionId>,
}

impl UserInfo {
    fn new() -> Self {
        UserInfo {
            connections: HashSet::new(),
        }
    }
}

pub struct Subscription {
    pub server_id: ServerId,
    pub channel_id: ChannelId,
}

impl AppState {
    pub fn new(convex: ConvexClient) -> Self {
        let (broadcast_tx, _broadcast_rx) = broadcast::channel(128);

        AppState {
            next_connection_id: Arc::new(Mutex::new(ConnectionId(1))),
            convex: convex,
            connections: Arc::new(Mutex::new(HashMap::new())),
            users: Arc::new(Mutex::new(HashMap::new())),
            broadcast_tx: broadcast_tx,
            server_subscriptions: Arc::new(Mutex::new(HashMap::new())),
            typing: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn add_connection(&self, user_id: UserId, tx: ClientTx) -> ConnectionId {
        let mut next_conn_id = self.next_connection_id.lock().unwrap();
        let conn_id = *next_conn_id;
        *next_conn_id += 1;
        self.connections.lock().unwrap().insert(
            conn_id,
            ConnectionInfo {
                tx,
                user_id: user_id.clone(),
                subscription: None,
            },
        );

        let mut users = self.users.lock().unwrap();
        let user_info = users.entry(user_id).or_insert(UserInfo::new());
        user_info.connections.insert(conn_id);

        conn_id
    }

    /// Returns true if at least one connection remains for the associated user.
    pub fn remove_connection(&self, connection_id: &ConnectionId) -> Result<bool, ()> {
        let mut res = true;
        let Some(conn_info) = self.connections.lock().unwrap().remove(connection_id) else {
            return Err(());
        };
        let mut users = self.users.lock().unwrap();

        let Some(user_info) = users.get_mut(&conn_info.user_id) else {
            println!(
                "Removed connection from `connections` map without removing entry from `users` map"
            );
            return Err(());
        };
        user_info.connections.remove(connection_id);
        if user_info.connections.is_empty() {
            users.remove(&conn_info.user_id);
            res = false;
        }

        let mut server_subs = self.server_subscriptions.lock().unwrap();
        if let Some(sub) = conn_info.subscription {
            if let Some(sub) = server_subs.get_mut(&sub.server_id) {
                sub.remove(&connection_id);
            }
        }

        Ok(res)
    }

    /// Sends message to all connections of a user.
    pub fn send_to_user(&self, user_id: &UserId, message: ServerMessage) {
        let users = self.users.lock().unwrap();
        let Some(user_info) = users.get(user_id) else {
            println!("User not connected");
            return;
        };

        let connections = self.connections.lock().unwrap();
        for conn in &user_info.connections {
            let Some(conn_info) = connections.get(&conn) else {
                println!("Connection info doesn't exist");
                continue;
            };
            conn_info.tx.send(message.clone()).unwrap();
        }
    }

    /// Sends message to a single connection.
    pub fn send_to_connection(&self, connection_id: &ConnectionId, message: ServerMessage) {
        let connections = self.connections.lock().unwrap();
        let Some(conn) = connections.get(connection_id) else {
            println!("Connection info doesn't exist");
            return;
        };
        conn.tx.send(message).unwrap();
    }

    pub fn broadcast(&self, message: ServerMessage) {
        self.broadcast_tx.send(message).unwrap();
    }
}

#[derive(Debug, PartialEq, Eq, Hash, Clone, Copy)]
pub struct ConnectionId(u64);

impl Add<u64> for ConnectionId {
    type Output = ConnectionId;

    fn add(self, rhs: u64) -> Self::Output {
        ConnectionId(self.0 + rhs)
    }
}

impl AddAssign<u64> for ConnectionId {
    fn add_assign(&mut self, rhs: u64) {
        *self = *self + rhs;
    }
}

impl Display for ConnectionId {
    fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
        write!(f, "{}", self.0)
    }
}
