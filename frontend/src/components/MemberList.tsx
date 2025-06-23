"use client";

import { Preloaded, usePreloadedQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useSocketContext } from "./SocketContext";

export default function MemberList({ preloadedMembers }: Readonly<{ preloadedMembers: Preloaded<typeof api.servers.getMembers> }>) {
    const members = usePreloadedQuery(preloadedMembers);
    const socket = useSocketContext();
    return (
        <div className="flex flex-col">
            {members?.map((x, i) => {
                const status = socket.userStatuses.find(y => y.userId === x.id)?.status || "Offline";
                console.log(x.id);
                return (<span key={i}>{x.name} • {status}</span>);
            })}
        </div>
    );
}