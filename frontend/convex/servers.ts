import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { getCurrentUserOrThrow } from "./users";
import { api } from "./_generated/api";
import { Id } from "./_generated/dataModel";

export const getMembers = query({
    args: { serverId: v.id("servers") },
    handler: async (ctx, args) => {
        const user = await getCurrentUserOrThrow(ctx);

        // Require that user is a member of this server.
        const membership = await ctx.db.query("userServers").withIndex("byUserServer", (q) => q.eq("userId", user._id).eq("serverId", args.serverId)).first();
        if (membership === null) {
            throw new Error("User not a member of this server.");
        }

        const members = await ctx.db.query("userServers").withIndex("byServer", (q) => q.eq("serverId", args.serverId)).collect();
        return Promise.all(members.map(async x => {
            const user = await ctx.db.get(x.userId);

            return { id: user?._id || "NO_USER_ID", name: user?.name || "NO_USER_NAME" }
        }));
    },
});

// export const getOwned = query({
//     args: {},
//     handler: async (ctx) => {
//         const user = await getCurrentUserOrThrow(ctx);

//         const servers = await ctx.db.query("servers").withIndex("byOwner", (q) => q.eq("owner", user._id)).collect();
//         return servers.map(x => ({ id: x._id, name: x.name }));
//     },
// });

export const getFirstJoinedServerChannel = query({
    args: {},
    handler: async (ctx) => {
        // Require authentication
        const user = await getCurrentUserOrThrow(ctx);

        // First server the user is a member of
        const membership = await ctx.db.query("userServers").withIndex("byUser", (q) => q.eq("userId", user._id)).first();
        if (membership === null) {
            throw new Error("User not a member of any servers.");
        }

        const channelId: Id<"channels"> = (await ctx.runQuery(api.channels.getFirst, { serverId: membership.serverId })).id;
        if (channelId === null) {
            throw new Error("Server has no channels.");
        }

        return { serverId: membership.serverId, channelId: channelId };
    },
});

export const getJoined = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx);

        const joinedServers = await ctx.db.query("userServers").withIndex("byUser", (q) => q.eq("userId", user._id)).collect();
        return Promise.all(joinedServers.map(async x => {
            const server = await ctx.db.get(x.serverId);

            return { id: server?._id || "NO_SERVER_ID", name: server?.name || "NO_SERVER_NAME" }
        }));
    },
});

export const getJoinedWithFirstChannel = query({
    args: {},
    handler: async (ctx) => {
        const user = await getCurrentUserOrThrow(ctx);

        const joinedServers = await ctx.db.query("userServers").withIndex("byUser", (q) => q.eq("userId", user._id)).collect();
        return Promise.all(joinedServers.map(async x => {
            const server = await ctx.db.get(x.serverId);

            if (server === null) throw new Error("User is member of server that doesn't exist");

            const channelId: Id<"channels"> = (await ctx.runQuery(api.channels.getFirst, { serverId: server._id })).id;
            if (channelId === null) {
                throw new Error("Server has no channels.");
            }

            return { serverId: server._id, serverName: server.name, channelId: channelId }
        }));
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

        // Auto-join user to the server they created.
        const _membershipId = ctx.db.insert("userServers", {
            userId: user._id,
            serverId: serverId
        });

        // Auto-create an initial channel.
        const _channelId = ctx.db.insert("channels", {
            name: "General",
            serverId: serverId
        });

        return serverId;
    },
})
