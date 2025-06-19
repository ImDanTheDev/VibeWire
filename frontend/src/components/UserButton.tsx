"use client";

import { User } from "lucide-react";
import { Button } from "./ui/button";
import { useClerk } from "@clerk/nextjs";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

export default function UserButton() {
    const { openUserProfile, signOut } = useClerk();
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary" size="icon" className="rounded-full aspect-square p-0 size-auto">
                    <User className="size-8" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
                <DropdownMenuItem onClick={() => { openUserProfile() }}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => { signOut() }}>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}