"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import MessageListEntry from "./MessageListEntry";

export default function MessageList({ preloadedMessages }: Readonly<{ preloadedMessages: Preloaded<typeof api.messages.getAll> }>) {
    const messages = usePreloadedQuery(preloadedMessages);

    return (
        <>
            {messages?.map((x, i) => <MessageListEntry key={i} body={x.body} creationTime={x.creationTime} senderName={x.sender.name} />)}
        </>
    );
}