"use client";

import { useEffect } from "react";
import { Id } from "../../convex/_generated/dataModel";
import { useChannelHistory } from "./ChannelHistoryContext";

export default function RememberChannel({ serverId, channelId }: Readonly<{ serverId: Id<"servers">, channelId: Id<"channels"> }>) {
    const history = useChannelHistory();

    useEffect(() => {
        history.set(serverId, channelId);
    }, [channelId]);

    return <></>;
}

export type ChannelHistory = {
    [key: Id<"servers">]: Id<"channels">
}