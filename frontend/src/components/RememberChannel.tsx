"use client";

import { useEffect } from "react";
import { Id } from "../../convex/_generated/dataModel";
import Cookies from 'js-cookie';

export default function RememberChannel({ serverId, channelId }: Readonly<{ serverId: Id<"servers">, channelId: Id<"channels"> }>) {
    useEffect(() => {
        let history: ChannelHistory = JSON.parse(Cookies.get("channelHistory") || "{}");
        history[serverId] = channelId;

        Cookies.set("channelHistory", JSON.stringify(history), {
            path: '/',
        });
    }, [channelId]);

    return <></>;
}

export type ChannelHistory = {
    [key: Id<"servers">]: Id<"channels">
}