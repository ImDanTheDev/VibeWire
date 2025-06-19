import { Id } from "../../convex/_generated/dataModel";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

export default function MessageListEntry({ senderName, body, creationTime }: Readonly<{ senderName: string, body: string, creationTime: number }>) {
    return (
        <div className="hover:bg-accent p-2 flex flex-row gap-2">
            <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>DM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
                <div className="flex flex-row -mt-1.5 items-end gap-2">
                    <span className="font-semibold">{senderName}</span>
                    <span className="mb-0.5 text-xs text-muted-foreground">{new Date(creationTime).toString()}</span>
                </div>
                <span>{body}</span>
            </div>
        </div>
    )
}