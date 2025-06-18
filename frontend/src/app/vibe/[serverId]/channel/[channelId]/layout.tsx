import MemberList from "@/components/MemberList";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"

export default async function ChannelLayout({ children, params }: Readonly<{ children: React.ReactNode, params: Promise<{ channelId: string }> }>) {

    const { channelId } = await params;

    return (
        <div className="flex flex-col  h-full">
            <div className="border-b p-1">
                <span>{channelId}</span>
            </div>
            <ResizablePanelGroup direction="horizontal" className="w-full">
                <ResizablePanel defaultSize={85} minSize={50} className="flex flex-col">
                    {children}
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={15}>
                    <MemberList />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}