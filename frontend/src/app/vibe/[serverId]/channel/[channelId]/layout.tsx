import MemberListWrapper from "@/components/MemberListWrapper";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { Id } from "../../../../../../convex/_generated/dataModel";
import Authenticated from "@/components/Authenticated";
import RememberChannel from "@/components/RememberChannel";

export default async function ChannelLayout({ children, params }: Readonly<{ children: React.ReactNode, params: Promise<{ serverId: Id<"servers">, channelId: Id<"channels"> }> }>) {
    const { channelId, serverId } = await params;

    return (
        <div className="flex flex-col  h-full">
            <RememberChannel serverId={serverId} channelId={channelId} />
            <div className="border-b p-1">
                <span>{channelId}</span>
            </div>
            <ResizablePanelGroup direction="horizontal" className="w-full">
                <ResizablePanel defaultSize={85} minSize={50} className="flex flex-col">
                    {children}
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={15}>
                    <Authenticated>
                        <MemberListWrapper serverId={serverId} />
                    </Authenticated>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}