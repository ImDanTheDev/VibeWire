import Link from "next/link";

export default async function ChannelListEntry({ name, serverId, channelId }: Readonly<{ name: string, serverId: string, channelId: string }>) {
    return (
        <Link href={`/vibe/${serverId}/channel/${channelId}`}>
            <div className="bg-accent rounded-sm px-2 py-1 text-nowrap">
                <span>{name}</span>
            </div>
        </Link>
    )
}