mod messages;
mod state;

use axum::{
    Extension, Router,
    body::Bytes,
    extract::{
        State,
        ws::{Message, Utf8Bytes, WebSocket, WebSocketUpgrade},
    },
    response::IntoResponse,
    routing::any,
};
use axum_extra::TypedHeader;
use clerk_rs::{
    ClerkConfiguration,
    clerk::Clerk,
    validators::{authorizer::ClerkJwt, axum::ClerkLayer, jwks::MemoryCacheJwksProvider},
};
use convex::{ConvexClient, Value};
use messages::{ClientMessage, ServerMessage};
use serde::{Deserialize, Serialize};
use state::AppState;
use tokio::sync::{
    RwLock,
    broadcast::{self, Sender},
    mpsc::{UnboundedSender, unbounded_channel},
};

use std::{
    collections::{BTreeMap, HashMap, HashSet},
    env,
    net::SocketAddr,
    time::SystemTime,
};
use std::{ops::ControlFlow, sync::Arc};
use tower_http::trace::{DefaultMakeSpan, TraceLayer};

use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

//allows to extract the IP of connecting user
use axum::extract::connect_info::ConnectInfo;
use axum::extract::ws::CloseFrame;

//allows to split the websocket stream into separate TX and RX branches
use futures_util::{sink::SinkExt, stream::StreamExt};

use crate::{messages::UserStatus, state::Subscription};

#[tokio::main]
async fn main() {
    dotenvy::dotenv().unwrap();

    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env().unwrap_or_else(|_| {
                format!("{}=debug,tower_http=debug", env!("CARGO_CRATE_NAME")).into()
            }),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    let config = ClerkConfiguration::new(
        None,
        None,
        Some(env::var("CLERK_SECRET_KEY").unwrap()),
        None,
    );
    let clerk = Clerk::new(config);
    let convex = ConvexClient::new(&env::var("CONVEX_DEPLOYMENT_URL").unwrap())
        .await
        .unwrap();

    let app_state = Arc::new(AppState::new(convex));

    tokio::spawn(server_initiated_messages(Arc::clone(&app_state)));

    let app = Router::new()
        .route("/ws", any(ws_handler))
        .layer(ClerkLayer::new(
            MemoryCacheJwksProvider::new(clerk),
            None,
            true,
        ))
        // logging so we can see what's going on
        .layer(
            TraceLayer::new_for_http()
                .make_span_with(DefaultMakeSpan::default().include_headers(true)),
        )
        .with_state(app_state);

    let listener = tokio::net::TcpListener::bind("127.0.0.1:3700")
        .await
        .unwrap();
    tracing::debug!("listening on {}", listener.local_addr().unwrap());
    axum::serve(
        listener,
        app.into_make_service_with_connect_info::<SocketAddr>(),
    )
    .await
    .unwrap();
}

async fn server_initiated_messages(app_state: Arc<AppState>) {
    //
}

type UserId = String;
type ServerId = String;
type ChannelId = String;

async fn ws_handler(
    ws: WebSocketUpgrade,
    ConnectInfo(addr): ConnectInfo<SocketAddr>,
    Extension(clerk_jwt): Extension<ClerkJwt>,
    State(state): State<Arc<AppState>>,
) -> impl IntoResponse {
    let user_id = match state
        .convex
        .clone()
        .query(
            "users:getUserIdByExternalUserId",
            BTreeMap::from([
                (
                    "serviceToken".to_string(),
                    Value::String(env::var("CONVEX_SERVICE_KEY").unwrap().to_string()),
                ),
                ("externalUserId".to_string(), Value::String(clerk_jwt.sub)),
            ]),
        )
        .await
    {
        Ok(convex::FunctionResult::Value(Value::String(user_id))) => user_id,
        _ => return "Unknown or invalid external user id".into_response(),
    };

    ws.on_upgrade(move |socket| handle_socket(socket, addr, user_id, state))
}

/// Actual websocket statemachine (one will be spawned per connection)
async fn handle_socket(socket: WebSocket, who: SocketAddr, user_id: String, state: Arc<AppState>) {
    let (mut ws_tx, mut ws_rx) = socket.split();

    println!("`{user_id}` at {who} connected.");

    // Channel to receive direct server messages.
    let (tx, mut rx) = unbounded_channel::<ServerMessage>();
    state.add_client(user_id.clone(), tx);

    // Subscribe to broadcasted server messages.
    let mut broadcast_rx = state.broadcast_tx.subscribe();

    // Task: Server-to-Client Messaging
    let ws_tx_state = Arc::clone(&state);
    let ws_tx_user_id = user_id.clone();
    let ws_tx_task = tokio::spawn(async move {
        let _ = ws_tx_state;
        let _ = ws_tx_user_id;
        loop {
            tokio::select! {
                // Receive direct messages from server
                Some(msg) = rx.recv() => {
                    // Send message to client.
                    ws_tx.send(Message::Text(serde_json::to_string(&msg).unwrap().into())).await.unwrap();
                }
                // Receive broadcasted messages from server
                Ok(msg) = broadcast_rx.recv() => {
                    // Send message to client.
                    ws_tx.send(Message::Text(serde_json::to_string(&msg).unwrap().into())).await.unwrap();
                }
                else => {
                    // All channeles closed
                    break;
                }
            }
        }
    });

    // Task: Client-to-Server Messaging
    let ws_rx_state = Arc::clone(&state);
    let ws_rx_user_id = user_id.clone();
    let ws_rx_task = tokio::spawn(async move {
        while let Some(msg) = ws_rx.next().await {
            match msg {
                Ok(msg) => match msg {
                    Message::Text(msg) => {
                        let msg: ClientMessage = serde_json::from_str(msg.as_str()).unwrap();
                        process_client_message(
                            ws_rx_user_id.clone(),
                            msg,
                            Arc::clone(&ws_rx_state),
                        );
                    }
                    _ => {
                        println!("Received unexpected message format: {msg:?}")
                    }
                },
                Err(err) => {
                    println!("Client-to-Server Error: {err}");
                    break;
                }
            }
        }
    });

    // Notify all users that are watching a server that this user is a member of, that this user came online.
    {
        let mut convex = state.convex.clone();
        let joined_ids = convex
            .query(
                "servers:getJoinedIds",
                BTreeMap::from([
                    (
                        "serviceToken".to_string(),
                        Value::String(env::var("CONVEX_SERVICE_KEY").unwrap().to_string()),
                    ),
                    ("userId".to_string(), Value::String(user_id.clone())),
                ]),
            )
            .await
            .unwrap();
        println!("JoinedIds: {joined_ids:?}");
        let server_ids = match joined_ids {
            convex::FunctionResult::Value(Value::Array(server_ids)) => server_ids
                .iter()
                .filter_map(|x| {
                    if let Value::String(id) = x {
                        Some(id.clone())
                    } else {
                        None
                    }
                })
                .collect::<Vec<_>>(),
            _ => {
                println!("Error getting ids of joined server: {joined_ids:?}");
                Vec::new()
            }
        };
        println!("ServerIds: {server_ids:?}");
        let server_subs = state.server_subscriptions.lock().unwrap();
        for server_id in server_ids {
            if let Some(user_ids) = server_subs.get(&server_id) {
                for recip_id in user_ids {
                    state.send_to_client(
                        &recip_id,
                        ServerMessage::StatusChange {
                            user_id: user_id.clone(),
                            status: UserStatus::Online,
                        },
                    );
                }
            }
        }
    }

    tokio::select! {
        _ = ws_tx_task => println!("Server-to-client task for {} finished.", user_id.clone()),
        _ = ws_rx_task => println!("Client-to-server task for {} finished.", user_id)
    }

    state.remove_client(&user_id);
    println!("Client {user_id} disconnected and cleaned up");

    // Notify all users that are watching a server that this user is a member of, that this user went offline.
    {
        let mut convex = state.convex.clone();
        let joined_ids = convex
            .query(
                "servers:getJoinedIds",
                BTreeMap::from([
                    (
                        "serviceToken".to_string(),
                        Value::String(env::var("CONVEX_SERVICE_KEY").unwrap().to_string()),
                    ),
                    ("userId".to_string(), Value::String(user_id.clone())),
                ]),
            )
            .await
            .unwrap();
        let server_ids = match joined_ids {
            convex::FunctionResult::Value(Value::Array(server_ids)) => server_ids
                .iter()
                .filter_map(|x| {
                    if let Value::String(id) = x {
                        Some(id.clone())
                    } else {
                        None
                    }
                })
                .collect::<Vec<_>>(),
            _ => {
                println!("Error getting ids of joined server: {joined_ids:?}");
                Vec::new()
            }
        };
        let server_subs = state.server_subscriptions.lock().unwrap();
        for server_id in server_ids {
            if let Some(user_ids) = server_subs.get(&server_id) {
                for recip_id in user_ids {
                    state.send_to_client(
                        &recip_id,
                        ServerMessage::StatusChange {
                            user_id: user_id.clone(),
                            status: UserStatus::Offline,
                        },
                    );
                }
            }
        }
    }

    // returning from the handler closes the websocket connection
    println!("Websocket context {who} destroyed");
}

fn process_client_message(user_id: UserId, msg: ClientMessage, state: Arc<AppState>) {
    match msg {
        ClientMessage::SubscribeToChannel {
            server_id,
            channel_id,
        } => {
            let mut subs = state.subscriptions.lock().unwrap();
            let mut server_subs = state.server_subscriptions.lock().unwrap();

            // Add new user sub, replacing the old one.
            if let Some(old_sub) = subs.insert(
                user_id.clone(),
                Subscription {
                    channel_id: channel_id.clone(),
                    server_id: server_id.clone(),
                },
            ) {
                // Remove existing server sub.
                if let Some(server_subs) = server_subs.get_mut(&old_sub.server_id) {
                    server_subs.remove(&user_id);
                }
            }

            // Add new server sub.
            server_subs
                .entry(server_id.clone())
                .and_modify(|server_subs| {
                    server_subs.insert(user_id.clone());
                })
                .or_insert([user_id.clone()].into());
            println!("{user_id} subscribed to {server_id}:{channel_id}");

            // TODO: Maybe combine into a message with array of user->status?
            // TODO: Send actual status, not just Online.
            for member_user_id in server_subs.get(&server_id).unwrap() {
                state.send_to_client(
                    &user_id,
                    ServerMessage::StatusChange {
                        user_id: member_user_id.clone(),
                        status: UserStatus::Online,
                    },
                );
            }
        }
        _ => {}
    }
}
