use serde::{Deserialize, Serialize};

use crate::{ChannelId, ServerId, UserId};

/// Sent by clients to server
#[derive(Debug, Clone, Deserialize)]
#[serde(tag = "kind")]
#[serde(rename_all = "camelCase")]
pub enum ClientMessage {
    /// Client sends when opening a channel to begin receiving messages related to the channel.
    #[serde(rename_all = "camelCase")]
    SubscribeToChannel {
        server_id: ServerId,
        channel_id: ChannelId,
    },
    /// Client sends when changing status.
    #[serde(rename_all = "camelCase")]
    ChangeStatus { status: UserStatus },
    /// Client sends typing indicator.
    #[serde(rename_all = "camelCase")]
    TypingStart {
        server_id: ServerId,
        channel_id: ChannelId,
    },
}

/// Sent by server to clients
#[derive(Debug, Clone, Serialize)]
#[serde(tag = "kind")]
#[serde(rename_all = "camelCase")]
pub enum ServerMessage {
    /// Server broadcasts to server(guild) subscribers when a new client connects or a user changes their status.
    #[serde(rename_all = "camelCase")]
    StatusChange { user_id: UserId, status: UserStatus },
    /// Server broadcasts to channel subscribers a list of active typers for a given channel when the list changes.
    #[serde(rename_all = "camelCase")]
    ActiveTypers {
        server_id: ServerId,
        channel_id: ChannelId,
        typers: Vec<UserId>,
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub enum UserStatus {
    Online,
    Offline,
    Away,
    DoNotDesturb,
}
