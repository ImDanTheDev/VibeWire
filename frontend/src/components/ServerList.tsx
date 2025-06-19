"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ServerListEntry from "./ServerListEntry";

export default function ServerList({ preloadedJoinedServers }: Readonly<{ preloadedJoinedServers: Preloaded<typeof api.servers.getJoined> }>) {
    const joinedServers = usePreloadedQuery(preloadedJoinedServers);
    return (
        <>
            {joinedServers?.map((x, i) => <ServerListEntry key={i} serverId={x.id} name={x.name} />)}
        </>
    );
}