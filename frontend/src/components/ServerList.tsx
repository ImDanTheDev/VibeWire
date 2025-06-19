"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ServerListEntry from "./ServerListEntry";

export default function ServerList({ preloadedOwnedServers }: Readonly<{ preloadedOwnedServers: Preloaded<typeof api.servers.getOwned> }>) {
    const ownedServers = usePreloadedQuery(preloadedOwnedServers);

    return (
        <>
            {ownedServers?.map((x, i) => <ServerListEntry key={i} serverId={x.id} name={x.name} />)}
        </>
    );
}