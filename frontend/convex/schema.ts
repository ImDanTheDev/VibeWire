import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
    users: defineTable({
        name: v.string(),
        externalId: v.string(),
    }).index("byExternalId", ["externalId"]),
    servers: defineTable({
        name: v.string(),
        owner: v.id("users")
    }).index("byOwner", ["owner"]),
    userServers: defineTable({
        userId: v.id("users"),
        serverId: v.id("servers"),
    }).index("byUser", ["userId"])
        .index("byServer", ["serverId"])
        .index("byUserServer", ["userId", "serverId"]),// Prevent user from joining server multiple times.
    channels: defineTable({
        name: v.string(),
        serverId: v.id("servers")
    }).index("byServerId", ["serverId"]),
    messages: defineTable({
        senderId: v.id("users"),
        channelId: v.id("channels"),
        body: v.string(),
    }).index("byChannelId", ["channelId"]),
    tasks: defineTable({
        isCompleted: v.boolean(),
        text: v.string()
    })
})