import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        externalId: v.string()
    }).index("byExternalId", ["externalId"]),
    servers: defineTable({
        name: v.string(),
        owner: v.id("users")
    }).index("byOwner", ["owner"]),
    channels: defineTable({
        name: v.string(),
        serverId: v.id("servers")
    }).index("byServerId", ["serverId"]),
    tasks: defineTable({
        isCompleted: v.boolean(),
        text: v.string()
    })
})