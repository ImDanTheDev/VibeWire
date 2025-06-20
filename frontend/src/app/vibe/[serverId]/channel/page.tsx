import { getAuthToken } from "@/lib/auth";
import { fetchQuery } from "convex/nextjs";
import { Id } from "../../../../../convex/_generated/dataModel";
import { api } from "../../../../../convex/_generated/api";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { ChannelHistory } from "@/components/RememberChannel";

export default async function ChannelsPage({ params }: Readonly<{ params: Promise<{ serverId: Id<"servers"> }> }>) {
    const { serverId } = await params;

    const cookies2 = await cookies();
    const channelHistory = cookies2.get("channelHistory");

    // Nothing to see here at /vibe/[serverId]/channel, so visit the most recently opened channel for this server,
    const history: ChannelHistory = JSON.parse(channelHistory?.value || "{}");
    const lastChannelForServer = history[serverId];
    if (lastChannelForServer) {
        redirect(`/vibe/${serverId}/channel/${lastChannelForServer}`);
    } else {
        // or open the first channel in this server.
        const firstChannel = await fetchQuery(api.channels.getFirst, {
            serverId: serverId
        }, {
            token: await getAuthToken()
        });

        redirect(`/vibe/${serverId}/channel/${firstChannel.id}`);
    }
}