"use server"

import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import ServerList from "./ServerList";
import { getAuthToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { ChannelHistory } from "./RememberChannel";

export default async function ServerListWrapper() {
    // Fetch joined servers on server to pass to ServerList for reactive changes on client.
    const preloadedJoinedServers = await preloadQuery(api.servers.getJoinedWithFirstChannel, {}, {
        token: await getAuthToken()
    });

    const cookies2 = await cookies();
    const channelHistory = cookies2.get("channelHistory");
    const history: ChannelHistory = JSON.parse(channelHistory?.value || "{}")
    return <ServerList preloadedJoinedServers={preloadedJoinedServers} history={history} />
}