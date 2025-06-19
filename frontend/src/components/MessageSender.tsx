"use client";

import { SendIcon } from "lucide-react";
import { Button } from "./ui/button";
import { TextareaAutosize } from "./ui/textarea-autosize";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";

export default function MessageSender({ channelId }: Readonly<{ channelId: Id<"channels"> }>) {
    const [message, setMessage] = useState<string>("");

    const createMessage = useMutation(api.messages.create);

    async function createMessageClicked() {
        await createMessage({
            body: message,
            channelId: channelId
        });
        setMessage("");
    }

    return (
        <>
            <TextareaAutosize placeholder="Message" className="resize-none max-h-full" value={message} onChange={(x) => setMessage(x.target.value)} />
            <Button type="submit" variant="outline" className="aspect-square" onClick={createMessageClicked}>
                <SendIcon />
            </Button>
        </>
    )
}