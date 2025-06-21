"use client";

import React, { createContext, useContext, useState } from "react";
import { ChannelHistory } from "./RememberChannel";
import { Id } from "../../convex/_generated/dataModel";
import Cookies from 'js-cookie';

type ChannelHistoryContextType = {
    history: ChannelHistory,
    set: (serverId: Id<"servers">, channelId: Id<"channels">) => void,
    get: (serverId: Id<"servers">) => Id<"channels">,
}

const ChannelHistoryContext = createContext<ChannelHistoryContextType | undefined>(undefined);

export default function ChannelHistoryProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    const [history, setHistory] = useState<ChannelHistory>(JSON.parse(Cookies.get("channelHistory") || "{}"));

    function set(serverId: Id<"servers">, channelId: Id<"channels">) {
        history[serverId] = channelId;
        setHistory({ ...history });
        Cookies.set("channelHistory", JSON.stringify(history));
    }

    function get(serverId: Id<"servers">) {
        return history[serverId];
    }

    return (
        <ChannelHistoryContext.Provider value={{ history, set, get }}>
            {children}
        </ChannelHistoryContext.Provider>
    )
}

export const useChannelHistory = () => {
    const ctx = useContext(ChannelHistoryContext);
    if (!ctx) throw new Error("useChannelHistory must be used within a ChannelHistoryProvider");
    return ctx;
}