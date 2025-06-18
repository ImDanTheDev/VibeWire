import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TextareaAutosize } from "@/components/ui/textarea-autosize"
import { SendIcon } from "lucide-react"

export default async function ChannelPage({ }) {
    return (
        <div className="flex flex-col h-full justify-end">
            <ScrollArea className="border-b grow-0 shrink min-h-0">
                <div className="flex flex-col">
                    {(() => {
                        return [...Array(20)].map((_, i) => (
                            <div key={i} className="hover:bg-accent p-2 flex flex-row gap-2">
                                <Avatar>
                                    <AvatarImage src="https://github.com/shadcn.png" />
                                    <AvatarFallback>DM</AvatarFallback>
                                </Avatar>
                                <div className="flex flex-col">
                                    <div className="flex flex-row -mt-1.5 items-end gap-2">
                                        <span className="font-semibold">ImDanTheDev</span>
                                        <span className="mb-0.5 text-xs text-muted-foreground">Yesterday at 8:28 PM</span>
                                    </div>
                                    <span>This is my message {i}</span>
                                </div>
                            </div>
                        ));
                    })()}
                </div>
            </ScrollArea>
            <div className="p-2 flex gap-2  max-h-1/2">
                <TextareaAutosize placeholder="Message" className="resize-none max-h-full" />
                <Button type="submit" variant="outline" className="aspect-square">
                    <SendIcon />
                </Button>
            </div>
        </div>
    )
}