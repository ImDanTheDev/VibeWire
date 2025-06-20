import Thing from "@/components/Thing";
import { SignOutButton } from "@clerk/nextjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Vibing() {
    const cookies2 = await cookies();
    const server = cookies2.get("lastOpenedServer");
    const channel = cookies2.get("lastOpenedChannel");

    if (server?.value) {
        if (channel?.value) {
            redirect(`/vibe/${server.value}/channel/${channel.value}`);
        }
        redirect(`/vibe/${server.value}`);
    }
    return (
        <>
            <span>Vibing</span>
            <SignOutButton />
            {/* <Thing /> */}
        </>
    );
}
