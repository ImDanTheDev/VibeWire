import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";

export const getAll = query({
    args: { serverId: v.id("servers"), channelId: v.id("channels") },
    handler: async (ctx, args) => {
        // Require authentication
        const user = await getCurrentUserOrThrow(ctx);

        // Ensure the channel exists in the provided server.
        const channel = await ctx.db.get(args.channelId);
        if (!channel) throw new Error("Channel does not exist");
        if (channel.serverId === undefined || channel.serverId !== args.serverId) throw new Error("Channel does not exist in server");

        // Require that user is a member of the server this channel belongs to.
        const membership = await ctx.db.query("userServers").withIndex("byUserServer", (q) => q.eq("userId", user._id).eq("serverId", args.serverId)).first();
        if (membership === null) {
            throw new Error("User not a member of this server.");
        }

        const messages = await ctx.db.query("messages").withIndex("byChannelId", (q) => q.eq("channelId", args.channelId)).collect();
        return Promise.all(messages.map(async x => {
            const sender = await ctx.db.get(x.senderId);

            return {
                id: x._id, body: x.body, sender: {
                    id: x.senderId,
                    name: sender?.name || "",
                }, creationTime: x._creationTime
            }
        }));
    },
});

export const create = mutation({
    args: { body: v.string(), channelId: v.id("channels") },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);
        const messageId = await ctx.db.insert("messages", {
            senderId: user._id,
            channelId: args.channelId,
            body: args.body,
        });

        return messageId;
    },
})
