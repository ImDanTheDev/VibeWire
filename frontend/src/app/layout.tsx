import type { Metadata } from "next";
import "./globals.css";
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
                <ConvexClientProvider>
                    {children}
                </ConvexClientProvider>
            </body>
        </html >

    );
}
