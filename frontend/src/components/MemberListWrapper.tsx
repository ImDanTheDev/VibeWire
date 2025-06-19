"use server"

import { preloadQuery } from "convex/nextjs";
import { api } from "../../convex/_generated/api";
import { getAuthToken } from "@/lib/auth";
import { Id } from "../../convex/_generated/dataModel";
import MemberList from "./MemberList";

export default async function MemberListWrapper({ serverId }: Readonly<{ serverId: Id<"servers"> }>) {
    // Fetch members to pass to MemberList for reactive changes on client.
    const preloadedMembers = await preloadQuery(api.servers.getMembers, {
        serverId
    }, {
        token: await getAuthToken()
    });

    return <MemberList preloadedMembers={preloadedMembers} />
}