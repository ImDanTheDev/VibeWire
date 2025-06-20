"use server"

import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { getAuthToken } from "@/lib/auth";
import MessageList from "./MessageList";
import { Id } from "../../convex/_generated/dataModel";

export default async function MessageListWrapper({ serverId, channelId }: Readonly<{ serverId: Id<"servers">, channelId: Id<"channels"> }>) {
    // Fetch owned servers on server to pass to ServerList for reactive changes on client.
    const preloadedMessages = await preloadQuery(api.messages.getAll, {
        channelId: channelId,
        serverId: serverId
    }, {
        token: await getAuthToken()
    });

    return <MessageList preloadedMessages={preloadedMessages} />
}