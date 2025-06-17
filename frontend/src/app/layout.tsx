import type { Metadata } from "next";
import "./globals.css";
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import ConvexClientProvider from "@/components/ConvexClientProvider";

export const metadata: Metadata = {
    title: "VibeWire",
    description: "Vibe with friends over the wire",
};

export default async function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (

        <html lang="en" className="dark h-full">
            <body
                className={`h-full`}
            >
                <ClerkProvider>
                    <ConvexClientProvider>
                        {children}
                    </ConvexClientProvider>
                </ClerkProvider>
            </body>
        </html >

    );
}
