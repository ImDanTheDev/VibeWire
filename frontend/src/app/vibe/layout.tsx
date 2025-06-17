"use client";

import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";

export default function VibeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <Authenticated>
                <div>
                    {children}
                    <UserButton />
                </div>
            </Authenticated>
            <Unauthenticated>
                <span>Not signed in</span>
                <SignInButton />
            </Unauthenticated>
        </>
    );
}
