import Link from "next/link";
import { Id } from "../../convex/_generated/dataModel";

// import { cookies } from "next/headers";
// import { ChannelHistory } from "./RememberChannel";

export default function ServerListEntry({ name, serverId, channelId }: Readonly<{ name: string, serverId: Id<"servers">, channelId: Id<"channels"> }>) {
    // const cookies2 = await cookies();
    // const channelHistory = cookies2.get("channelHistory");
    // const history: ChannelHistory = JSON.parse(channelHistory?.value || "{}")

    return (
        <Link href={`/vibe/${serverId}/channel/${channelId}`}>
            <div className="rounded-full bg-accent aspect-square flex justify-center items-center">
                <span>{name}</span>
            </div>
        </Link>
    )
}