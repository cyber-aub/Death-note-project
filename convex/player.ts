import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const storePlayer = mutation({
    args: {
        secret1: v.string(),
        secret2: v.string(),
        secret3: v.string(),
        secret4: v.string(),
        secret5: v.string(),
        name: v.optional(v.string()),
        background: v.string(),
        profilePicture: v.string(),
    },
    handler: async (ctx, args) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called storeUser without authentication present");
        }


        const user = await ctx.db
            .query("players")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();


        const data = {
            ...args, name: args.name ?? identity.name!
        }

        if (user !== null) {
            await ctx.db.patch(user._id, { ...data });

            return user._id;
        }

        return await ctx.db.insert("players", {
            tokenIdentifier: identity.tokenIdentifier,
            ...data
        });
    },
});

export const loadPlayerProfile = query({
    args: {},
    handler: async (ctx,) => {
        const identity = await ctx.auth.getUserIdentity();
        if (!identity) {
            throw new Error("Called loadPlayerProfile without authentication present");
        }

        const user = await ctx.db
            .query("players")
            .withIndex("by_token", (q) =>
                q.eq("tokenIdentifier", identity.tokenIdentifier)
            )
            .unique();

        return user;
    },
});