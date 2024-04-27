import { v } from "convex/values";
import { mutation, query } from "./_generated/server";


export const sendMessage = mutation({
    args: {
        message: v.string(),
        isKira: v.boolean(),
        isLawliet: v.boolean(),
        gameId: v.id("games"),
        round: v.number(),
        avatar: v.string(),
        name: v.string(),

    },
    handler: async (ctx, args) => {
        const playerId = await ctx.auth.getUserIdentity()
        const {isKira,isLawliet} = args

        const kiraAvatar = "https://i.pinimg.com/564x/47/77/60/477760ce0d60120f68caf17fda579e73.jpg"
        const lawlietAvatar = "https://i.pinimg.com/564x/fe/9b/0d/fe9b0d9615bc25ef44161c32cd1586c0.jpg"
        const author = isKira? "Kira" : isLawliet? "Lawliet" : args.name
        const avatar = isKira? kiraAvatar : isLawliet? lawlietAvatar : args.avatar

        await ctx.db.insert("chat", {
            gameId: args.gameId,
            message: args.message,
            author: author,
            senderId: playerId!.tokenIdentifier,
            avatar: avatar,
            round: args.round,
        })
    }
})

export const loadRoundMessages = query({
    args: {
        gameId: v.id("games"),
        round: v.number(),
    },
    handler: async (ctx, args) => {
        
       return  await ctx.db.query("chat")
       .withIndex("by_gameId_round",
       (q) => q.eq("gameId", args.gameId).eq("round", args.round))
        .collect()
    },
})