use std::{
    collections::{HashMap, HashSet},
    sync::{Arc, Mutex},
};

use convex::ConvexClient;
use tokio::sync::{broadcast, mpsc::UnboundedSender};

use crate::{ChannelId, ServerId, ServerMessage, UserId};

type ClientTx = UnboundedSender<ServerMessage>;
type BroadcastTx = broadcast::Sender<ServerMessage>;

// TODO: Store state by connection id, not user id, to allow multiple connections for the same user. (multiple browser tabs/devices/etc)
// TODO:   ConnectionId -> UserId
// TODO:   ConnectionId -> Subscription
pub struct AppState {
    pub convex: ConvexClient,
    pub clients: Arc<Mutex<HashMap<UserId, ClientTx>>>,
    pub broadcast_tx: BroadcastTx,
    pub subscriptions: Arc<Mutex<HashMap<UserId, Subscription>>>,
    pub server_subscriptions: Arc<Mutex<HashMap<ServerId, HashSet<UserId>>>>,
}

pub struct Subscription {
    pub server_id: ServerId,
    pub channel_id: ChannelId,
}

impl AppState {
    pub fn new(convex: ConvexClient) -> Self {
        let (broadcast_tx, _broadcast_rx) = broadcast::channel(128);

        AppState {
            convex: convex,
            clients: Arc::new(Mutex::new(HashMap::new())),
            broadcast_tx: broadcast_tx,
            subscriptions: Arc::new(Mutex::new(HashMap::new())),
            server_subscriptions: Arc::new(Mutex::new(HashMap::new())),
        }
    }

    pub fn add_client(&self, user_id: UserId, tx: ClientTx) {
        self.clients.lock().unwrap().insert(user_id, tx);
    }

    pub fn remove_client(&self, user_id: &UserId) {
        self.clients.lock().unwrap().remove(user_id);
    }

    pub fn send_to_client(&self, user_id: &UserId, message: ServerMessage) {
        let clients = self.clients.lock().unwrap();
        if let Some(tx) = clients.get(user_id) {
            tx.send(message).unwrap();
        }
    }

    pub fn broadcast(&self, message: ServerMessage) {
        self.broadcast_tx.send(message).unwrap();
    }
}
