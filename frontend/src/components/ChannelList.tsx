"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import ChannelListEntry from "./ChannelListEntry";
import { Id } from "../../convex/_generated/dataModel";

export default function ServerList({ serverId, preloadedChannels }: Readonly<{ serverId: Id<"servers">, preloadedChannels: Preloaded<typeof api.channels.get> }>) {
    const channels = usePreloadedQuery(preloadedChannels);

    return (
        <>
            {channels?.map((x, i) => <ChannelListEntry key={i} serverId={serverId} channelId={x.id} name={x.name} />)}
        </>
    );
}