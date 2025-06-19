import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const get = query({
    args: {
        serverId: v.id("servers")
    },
    handler: async (ctx, { serverId }) => {
        // Require authentication
        await getCurrentUserOrThrow(ctx);

        const channels = await ctx.db.query("channels").withIndex("byServerId", (q) => q.eq("serverId", serverId)).collect();
        return channels.map(x => ({ id: x._id, name: x.name }));
    },
});

export const create = mutation({
    args: { name: v.string(), serverId: v.id("servers") },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);

        const channelId = await ctx.db.insert("channels", {
            name: args.name,
            serverId: args.serverId
        });

        return channelId;
    },
})
