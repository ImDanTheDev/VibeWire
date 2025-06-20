import ChannelListWrapper from "@/components/ChannelListWrapper";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Id } from "../../../../convex/_generated/dataModel";
import CreateChannel from "@/components/CreateChannel";
import Authenticated from "@/components/Authenticated";
import RememberServer from "@/components/RememberServer";

export default async function ServerLayout({ children, params }: Readonly<{ children: React.ReactNode, params: Promise<{ serverId: Id<"servers"> }> }>) {
    const { serverId } = await params;

    return (
        <>
            <RememberServer serverId={serverId} />
            <ResizablePanelGroup direction="horizontal" className="w-full">
                <ResizablePanel defaultSize={15} minSize={5}>
                    <ScrollArea className="h-full border-r">
                        <div className="flex flex-col gap-1 p-1">
                            <Authenticated>
                                <CreateChannel serverId={serverId} />
                                <ChannelListWrapper serverId={serverId} />
                            </Authenticated>
                        </div>
                    </ScrollArea>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={85}>
                    {children}
                </ResizablePanel>
            </ResizablePanelGroup>
        </>
    )
}