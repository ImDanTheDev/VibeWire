"use client";

import { useEffect } from "react";
import { Id } from "../../convex/_generated/dataModel";
import Cookies from 'js-cookie';

export default function RememberServer({ serverId }: Readonly<{ serverId: Id<"servers"> }>) {
    useEffect(() => {
        Cookies.set("lastOpenedServer", serverId, {
            path: '/',
        });
    }, [serverId]);

    return <></>;
}