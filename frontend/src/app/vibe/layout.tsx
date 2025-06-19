import { ScrollArea } from "@/components/ui/scroll-area";

import ServerListWrapper from "@/components/ServerListWrapper";
import CreateServer from "@/components/CreateServer";
import UserButton from "@/components/UserButton";
import Authenticated from "@/components/Authenticated";

export default function VibeLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {

    return (
        <>
            <div className="flex flex-row h-full">
                <ScrollArea className="h-full border-r">
                    <div className="flex flex-col gap-1 p-1 w-14">
                        <Authenticated>
                            <UserButton />
                            <ServerListWrapper />
                            <CreateServer />
                        </Authenticated>
                    </div>
                </ScrollArea>
                {children}
            </div>
        </>
    );
}
