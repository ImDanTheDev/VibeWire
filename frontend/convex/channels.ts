import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const get = query({
    args: {
        serverId: v.id("servers")
    },
    handler: async (ctx, { serverId }) => {
        // Require authentication
        const user = await getCurrentUserOrThrow(ctx);

        // Require that user is a member of this server.
        const membership = await ctx.db.query("userServers").withIndex("byUserServer", (q) => q.eq("userId", user._id).eq("serverId", serverId)).first();
        if (membership === null) {
            throw new Error("User not a member of this server.");
        }

        const channels = await ctx.db.query("channels").withIndex("byServerId", (q) => q.eq("serverId", serverId)).collect();
        return channels.map(x => ({ id: x._id, name: x.name }));
    },
});

export const create = mutation({
    args: { name: v.string(), serverId: v.id("servers") },
    handler: async (ctx, args) => {
        await getCurrentUserOrThrow(ctx);

        const channelId = await ctx.db.insert("channels", {
            name: args.name,
            serverId: args.serverId
        });

        return channelId;
    },
})
