"use server"

import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import ServerList from "./ServerList";
import { getAuthToken } from "@/lib/auth";
import { Id } from "../../convex/_generated/dataModel";
import ChannelList from "./ChannelList";

export default async function ChannelListWrapper({ serverId }: Readonly<{ serverId: Id<"servers"> }>) {
    // Fetch channels to pass to ChannelList for reactive changes on client.
    const preloadedOwnedChannels = await preloadQuery(api.channels.get, {
        serverId
    }, {
        token: await getAuthToken()
    });

    return <ChannelList serverId={serverId} preloadedChannels={preloadedOwnedChannels} />
}