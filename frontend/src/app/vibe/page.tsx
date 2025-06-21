import { ChannelHistory } from "@/components/RememberChannel";
import { SignOutButton } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Id } from "../../../convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import { api } from "../../../convex/_generated/api";
import { getAuthToken } from "@/lib/auth";

export default async function Vibing() {
    const cookies2 = await cookies();
    const server = cookies2.get("lastOpenedServer");
    const channelHistory = cookies2.get("channelHistory");

    // Nothing to see here at /vibe, so visit the most recently opened channel for the most recent server.
    if (server?.value) {
        const history: ChannelHistory = JSON.parse(channelHistory?.value || "{}");
        const lastChannelForServer = history[server.value as Id<"servers">];
        if (lastChannelForServer) {
            redirect(`/vibe/${server.value}/channel/${lastChannelForServer}`);
        }
        redirect(`/vibe/${server.value}`);
    } else {
        const first = await fetchQuery(api.servers.getFirstJoinedServerChannel, {}, {
            token: await getAuthToken()
        });

        redirect(`/vibe/${first.serverId}/channel/${first.channelId}`);
    }
    return (
        <>
            <span>Vibing</span>
            <SignOutButton />
            {/* <Thing /> */}
        </>
    );
}
