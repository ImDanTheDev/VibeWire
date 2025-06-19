"use client";

import { Plus, Save } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { PopoverClose } from "@radix-ui/react-popover";

export default function CreateServer() {
    const [serverName, setServerName] = useState<string>("");

    const createServer = useMutation(api.servers.create);

    function createServerClicked() {
        createServer({
            name: serverName
        })
    }

    return (
        <Popover>
            <PopoverTrigger asChild>

                <Button variant="secondary" size="icon" className="rounded-full aspect-square size-auto p-0">
                    <Plus className="size-8" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 grid gap-2" align="start">
                <div className="space-y-2">
                    <h4 className="leading-none font-medium">Create Server</h4>
                    <p className="text-muted-foreground text-sm">
                        Enter the name for the server.
                    </p>
                </div>
                <div className="flex flex-row gap-2">
                    <Input type="text" value={serverName} onChange={(x) => setServerName(x.target.value)} />
                    <PopoverClose asChild>
                        <Button variant={"secondary"} className="aspect-square" onClick={createServerClicked}>
                            <Save />
                        </Button>
                    </PopoverClose>
                </div>
            </PopoverContent>
        </Popover>
    );
}