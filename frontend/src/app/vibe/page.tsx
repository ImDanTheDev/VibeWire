import Thing from "@/components/Thing";
import { SignOutButton } from "@clerk/nextjs";

export default async function Vibing() {

    return (
        <>
            <span>Vibing</span>
            <SignOutButton />
            <Thing />
        </>
    );
}
