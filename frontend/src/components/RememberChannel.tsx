"use client";

import { useContext, useEffect } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useChannelHistory } from "./ChannelHistoryContext";
import { useSocket, useSocketContext } from "./SocketContext";

export default function RememberChannel({ serverId, channelId }: Readonly<{ serverId: Id<"servers">, channelId: Id<"channels"> }>) {
    const history = useChannelHistory();
    const ctx = useSocketContext();

    useEffect(() => {
        history.set(serverId, channelId);
        ctx.send({
            kind: "subscribeToChannel",
            serverId: serverId,
            channelId: channelId
        });
    }, [channelId]);

    return <></>;
}

export type ChannelHistory = {
    [key: Id<"servers">]: Id<"channels">
}