"use server"

import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import ServerList from "./ServerList";
import { getAuthToken } from "@/lib/auth";

export default async function ServerListWrapper() {
    // Fetch owned servers on server to pass to ServerList for reactive changes on client.
    const preloadedOwnedServers = await preloadQuery(api.servers.getOwned, {}, {
        token: await getAuthToken()
    });

    return <ServerList preloadedOwnedServers={preloadedOwnedServers} />
}