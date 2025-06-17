"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Thing() {
    const tasks = useQuery(api.tasks.get);

    return (
        <>
            {tasks?.map(({ _id, text }) => <div key={_id}>{text}</div>)}
        </>
    );
}