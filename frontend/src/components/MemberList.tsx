"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function MemberList({ preloadedMembers }: Readonly<{ preloadedMembers: Preloaded<typeof api.servers.getMembers> }>) {
    const members = usePreloadedQuery(preloadedMembers);

    return (
        <div className="flex flex-col">
            {members?.map((x, i) => <span key={i}>{x.name}</span>)}
        </div>
    );
}