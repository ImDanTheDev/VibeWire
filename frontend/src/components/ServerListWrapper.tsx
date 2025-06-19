"use server"

import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import ServerList from "./ServerList";
import { getAuthToken } from "@/lib/auth";

export default async function ServerListWrapper() {
    // Fetch joined servers on server to pass to ServerList for reactive changes on client.
    const preloadedJoinedServers = await preloadQuery(api.servers.getJoined, {}, {
        token: await getAuthToken()
    });

    return <ServerList preloadedJoinedServers={preloadedJoinedServers} />
}