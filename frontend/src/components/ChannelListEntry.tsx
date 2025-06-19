import Link from "next/link";
import { Id } from "../../convex/_generated/dataModel";

export default function ChannelListEntry({ name, serverId, channelId }: Readonly<{ name: string, serverId: Id<"servers">, channelId: Id<"channels"> }>) {
    return (
        <Link href={`/vibe/${serverId}/channel/${channelId}`}>
            <div className="bg-accent rounded-sm px-2 py-1 text-nowrap">
                <span>{name}</span>
            </div>
        </Link>
    )
}