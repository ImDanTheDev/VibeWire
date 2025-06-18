"use client";

import ServerListEntry from "@/components/ServerListEntry";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SignInButton, useClerk } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { Plus, Save, User } from "lucide-react";

export default function VibeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    const { openUserProfile, signOut } = useClerk();

    return (
        <>
            <Authenticated>
                <div className="flex flex-row h-full">
                    <ScrollArea className="h-full border-r">
                        <div className="flex flex-col gap-1 p-1">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="secondary" size="icon" className="rounded-full aspect-square w-12 h-auto p-0">
                                        <User className="size-8" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-56" align="start">
                                    <DropdownMenuItem onClick={() => { openUserProfile() }}>Profile</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { signOut() }}>Sign out</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                            <ServerListEntry name="S1" serverId="129" />
                            <ServerListEntry name="S2" serverId="228" />
                            <ServerListEntry name="S3" serverId="549" />
                            <ServerListEntry name="S4" serverId="198" />
                            <ServerListEntry name="S5" serverId="314" />
                            <Popover>
                                <PopoverTrigger asChild>

                                    <Button variant="secondary" size="icon" className="rounded-full aspect-square w-12 h-auto p-0">
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
                                        <Input type="text" />
                                        <Button variant={"secondary"} className="aspect-square">
                                            <Save />
                                        </Button>
                                    </div>
                                </PopoverContent>
                            </Popover>

                        </div>
                    </ScrollArea>
                    {children}
                </div>
            </Authenticated>
            <Unauthenticated>
                <span>Not signed in</span>
                <SignInButton />
            </Unauthenticated>
        </>
    );
}
