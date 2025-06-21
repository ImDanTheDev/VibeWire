"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ServerListEntry from "./ServerListEntry";
import { ChannelHistory } from "./RememberChannel";
import { useChannelHistory } from "./ChannelHistoryContext";

export default function ServerList({ preloadedJoinedServers, history }: Readonly<{ preloadedJoinedServers: Preloaded<typeof api.servers.getJoinedWithFirstChannel>, history: ChannelHistory }>) {
    const joinedServers = usePreloadedQuery(preloadedJoinedServers);
    const channelHistory = useChannelHistory();

    return (
        <>
            {joinedServers?.map((x, i) => {
                const lastChannelForServer = channelHistory.get(x.serverId);
                return <ServerListEntry key={i} serverId={x.serverId} name={x.serverName} channelId={lastChannelForServer || x.channelId} />
            })}
        </>
    );
}