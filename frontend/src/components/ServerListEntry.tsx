import Link from "next/link";

export default function ServerListEntry({ name, serverId }: Readonly<{ name: string, serverId: string }>) {
    return (
        <Link href={`/vibe/${serverId}`}>
            <div className="rounded-full bg-accent aspect-square flex justify-center items-center">
                <span>{name}</span>
            </div>
        </Link>
    )
}