import ChannelListEntry from "@/components/ChannelListEntry"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Save } from "lucide-react";

export default async function ServerLayout({ children, params }: Readonly<{ children: React.ReactNode, params: Promise<{ serverId: string }> }>) {
    const { serverId } = await params;

    return (
        <ResizablePanelGroup direction="horizontal" className="w-full">
            <ResizablePanel defaultSize={15} minSize={5}>
                <ScrollArea className="h-full border-r">
                    <div className="flex flex-col gap-1 p-1">
                        <Popover>
                            <PopoverTrigger asChild>

                                <div className="bg-accent rounded-sm px-2 py-1 text-nowrap">
                                    <span>Create Channel</span>
                                </div>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 grid gap-2" align="start">
                                <div className="space-y-2">
                                    <h4 className="leading-none font-medium">Create Channel</h4>
                                    <p className="text-muted-foreground text-sm">
                                        Enter the name for the channel.
                                    </p>
                                </div>
                                <div className="flex flex-row gap-2">
                                    <Input type="text" />
                                    <Button variant={"secondary"} className="aspect-square">
                                        <Save />
                                    </Button>
                                </div>
                            </PopoverContent>
                        </Popover>
                        <ChannelListEntry name="general" serverId={serverId} channelId="654" />
                        <ChannelListEntry name="gaming" serverId={serverId} channelId="138" />
                        <ChannelListEntry name="memes" serverId={serverId} channelId="798" />
                    </div>
                </ScrollArea>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel defaultSize={85}>
                {children}
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}