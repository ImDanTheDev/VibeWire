import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const getOwned = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx);

        const servers = await ctx.db.query("servers").withIndex("byOwner", (q) => q.eq("owner", user._id)).collect();
        return servers.map(x => ({ id: x._id, name: x.name }));
    },
});

export const create = mutation({
    args: { name: v.string() },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        const serverId = await ctx.db.insert("servers", {
            name: args.name,
            owner: user._id
        });

        return serverId;
    },
})
