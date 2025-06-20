"use client";

import { useEffect } from "react";
import { Id } from "../../convex/_generated/dataModel";
import Cookies from 'js-cookie';

export default function RememberChannel({ channelId }: Readonly<{ channelId: Id<"channels"> }>) {
    useEffect(() => {
        Cookies.set("lastOpenedChannel", channelId, {
            path: '/',
        });
    }, [channelId]);

    return <></>;
}