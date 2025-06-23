"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react"
import { Id } from "../../convex/_generated/dataModel";

type SocketContextType = {
    userStatuses: { userId: Id<"users">, status: UserStatus }[],
    connected: boolean,
    num: number,
    send: (data: Record<string, any>) => void
}

type UserStatus = "Online" | "Offline" | "Away" | "DoNotDesturb";


const SocketContext = createContext<SocketContextType | undefined>(undefined);

type Message = RandomNumber | Heartbeat | StatusChange;
type RandomNumber = {
    kind: "randomNumber",
    value: number
}
type Heartbeat = {
    kind: "heartbeat"
}
type StatusChange = {
    kind: "statusChange"
    userId: Id<"users">,
    status: UserStatus
}

export default function SocketProvider({ children }: Readonly<{ children: React.ReactNode }>) {
    // const [num, setNum] = useState<number>(0);
    const [userStatuses, setUserStatuses] = useState<{ userId: Id<"users">, status: UserStatus }[]>([]);

    const onOpen = useCallback(() => {

    }, []);

    const onClose = useCallback(() => {

    }, []);

    const onError = useCallback(() => {

    }, []);

    const onMessage = useCallback((ev: MessageEvent) => {
        processMessage(JSON.parse(ev.data))
    }, []);

    const { send, connected } = useSocket({
        onOpen,
        onClose,
        onError,
        onMessage
    })

    function processMessage(msg: Message) {
        console.log(msg);
        switch (msg.kind) {
            case "heartbeat":
                console.log("Heartbeat");
                break;
            case "randomNumber":
                // setNum(data.value);
                break;
            case "statusChange":
                setUserStatuses((oldStatuses) => {
                    return [...oldStatuses.filter(x => x.userId !== msg.userId), {
                        userId: msg.userId,
                        status: msg.status
                    }];
                });
                break;
        }
    }

    return (
        <SocketContext.Provider value={{ connected, userStatuses, num: 0, send }}>
            {connected ? children : <span>Connecting</span>}
        </SocketContext.Provider>
    );

}

export const useSocket = (options: { onOpen: (ev: Event) => void, onMessage: (ev: MessageEvent) => void, onError: (ev: Event) => void, onClose: (ev: Event) => void }) => {
    const { onOpen, onMessage, onError, onClose } = options;
    const [connected, setConnected] = useState<boolean>(false);
    const ws = useRef<WebSocket>(null);

    const connect = useCallback(() => {
        if (ws.current && ws.current.readyState === WebSocket.OPEN || ws.current?.readyState === WebSocket.CONNECTING) {
            return
        }

        ws.current = new WebSocket("http://localhost:3700/ws");
        ws.current.onopen = (ev) => {
            console.log("WebSocket connected");
            setConnected(true);
            onOpen?.(ev);
        }

        ws.current.onmessage = (ev) => {
            onMessage?.(ev)
        }

        ws.current.onerror = (ev) => {
            console.log("WebSocket error:", ev);
            onError?.(ev);
        }

        ws.current.onclose = (ev) => {
            console.log("WebSocket closed:", ev.code, ev.reason);
            setConnected(false);
            ws.current = null;
            onClose?.(ev);
        }
    }, [onOpen, onMessage, onError, onClose]);

    const disconnect = useCallback(() => {
        if (ws.current) {
            ws.current.close();
            ws.current = null;
        }
    }, []);

    const send = useCallback((data: Record<string, any>) => {
        if (!(ws.current && ws.current.readyState === WebSocket.OPEN)) {
            console.warn("WebSocket is not open. Message not sent:", data);
            return;
        }

        try {
            ws.current.send(JSON.stringify(data))
        } catch (err) {
            console.warn("Failed to send message:", err);
        }
    }, []);

    useEffect(() => {
        connect();

        return () => {
            disconnect();
        }
    }, [connect, disconnect]);

    return {
        connect, disconnect, send, connected
    }
}

export const useSocketContext = () => {
    const ctx = useContext(SocketContext);
    if (!ctx) {
        throw new Error("useSocketContext must be used within a SocketProvider");
    }

    return ctx;
}