import { query } from "./_generated/server";

export const get = query({
    args: {},
    handler: async (ctx) => {
        console.log("server identity", await ctx.auth.getUserIdentity());
        const identity = await ctx.auth.getUserIdentity();
        if (identity === null) {
            throw new Error("Not authenticated");
        }
        return await ctx.db.query("tasks").collect();
    },
});