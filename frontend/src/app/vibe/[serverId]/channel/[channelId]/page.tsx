import MessageListWrapper from "@/components/MessageListWrapper"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Id } from "../../../../../../convex/_generated/dataModel"
import Authenticated from "@/components/Authenticated"
import MessageSender from "@/components/MessageSender"

export default async function ChannelPage({ params }: Readonly<{ params: Promise<{ serverId: Id<"servers">, channelId: Id<"channels"> }> }>) {
    const { serverId, channelId } = await params;
    return (
        <div className="flex flex-col h-full justify-end">
            <ScrollArea className="border-b grow-0 shrink min-h-0">
                <div className="flex flex-col">
                    <Authenticated>
                        <MessageListWrapper serverId={serverId} channelId={channelId} />
                    </Authenticated>
                </div>
            </ScrollArea>
            <div className="p-2 flex gap-2  max-h-1/2">
                <Authenticated>
                    <MessageSender channelId={channelId} />
                </Authenticated>
            </div>
        </div>
    )
}