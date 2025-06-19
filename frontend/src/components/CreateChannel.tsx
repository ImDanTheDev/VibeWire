"use client";

import { Plus, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";
import { Id } from "../../convex/_generated/dataModel";

export default function CreateChannel({ serverId }: Readonly<{ serverId: Id<"servers"> }>) {
    const [channelName, setChannelName] = useState<string>("");

    const createChannel = useMutation(api.channels.create);

    function createChannelClicked() {
        createChannel({
            name: channelName,
            serverId
        })
    }

    return (
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
                    <Input type="text" value={channelName} onChange={(x) => setChannelName(x.target.value)} />
                    <PopoverClose asChild>
                        <Button variant={"secondary"} className="aspect-square" onClick={createChannelClicked}>
                            <Save />
                        </Button>
                    </PopoverClose>
                </div>
            </PopoverContent>
        </Popover>
    );
}