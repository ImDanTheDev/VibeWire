"use client";

import { SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { TextareaAutosize } from "./ui/textarea-autosize";
import { ChangeEvent, useRef, useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useSocketContext } from "./SocketContext";

export default function MessageSender({ serverId, channelId }: Readonly<{ serverId: Id<"servers">, channelId: Id<"channels"> }>) {
    const [message, setMessage] = useState<string>("");
    const typingTimeout = useRef<NodeJS.Timeout>(undefined);
    const lastTypingEmit = useRef<number>(0);

    const createMessage = useMutation(api.messages.create);
    const socket = useSocketContext();

    async function createMessageClicked() {
        await createMessage({
            body: message,
            channelId: channelId
        });
        setMessage("");
    }

    function handleTyping(ev: ChangeEvent<HTMLTextAreaElement>) {
        setMessage(ev.target.value);

        // Send "typingStart" message every 5s
        const now = Date.now();
        if (now - lastTypingEmit.current > 5000) {
            socket.send({
                kind: "typingStart",
                serverId: serverId,
                channelId: channelId
            });
            lastTypingEmit.current = now;
        }
    }

    return (
        <>
            <TextareaAutosize placeholder="Message" className="resize-none max-h-full" value={message} onChange={handleTyping} />
            <Button type="submit" variant="outline" className="aspect-square" onClick={createMessageClicked}>
                <SendIcon />
            </Button>
        </>
    )
}