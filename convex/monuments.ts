import { v } from "convex/values"
import { Doc } from "./_generated/dataModel"
import { internalMutation, internalQuery, query } from "./_generated/server"
import { formatRoundMessages } from "./_helpers/ai_helper"

export const loadGameMonuments = query(
    {
        args: { gameId: v.id("games"), },
        handler: async (ctx, args) => {

            const monuments = await ctx.db.query("monuments").withIndex("by_gameId_round", (q) =>
                q.eq("gameId", args.gameId)
            ).collect()

            return monuments
        }
    }
)


export const storeGameMonument = internalMutation(
    {
        args: { gameId: v.id("games"), monumentId: v.optional(v.id("monuments")), roundId: v.number(), epic: v.optional(v.string()), epicUrl: v.optional(v.string()) },
        handler: async (ctx, args) => {

            const monument = await ctx.db
                .query("monuments")
                .withIndex("by_gameId_round", (q) =>
                    q.eq("gameId", args.gameId)
                        .eq("round", args.roundId)
                )
                .unique();


            if (monument !== null) {
            

                if (!args.epic && !args.epicUrl) {
                    return { monumentId: monument._id,
                        epicStory:monument.epicStory, 
                        epicImageUrl: monument.epicImageUrl,
                        imagePrompt : monument.imagePrompt,
                    }
                }

                const patchedMonument: Partial<Doc<"monuments">> = {
                }

                if (args.epic !== undefined) {
                    patchedMonument.epicStory = args.epic
                }

                if (args.epicUrl !== undefined) {
                    patchedMonument.epicImageUrl = args.epicUrl
                }

                await ctx.db.patch(monument._id, patchedMonument)
                return { monumentId: monument._id, 
                    epicStory:patchedMonument.epicStory ?? monument.epicStory, 
                    epicImageUrl:patchedMonument.epicImageUrl ??  monument.epicImageUrl,
                    imagePrompt : monument.imagePrompt,
                }
            }

            const monumentId = await ctx.db.insert("monuments", {
                gameId: args.gameId,
                round: args.roundId,
            })

            return { monumentId}
        },
    }
)

export const compileRound = internalQuery(
    {
        args: { gameId: v.id("games"), roundId: v.number() },
        handler: async (ctx, args) => {
            const roundMessages = await ctx.db.query("chat").withIndex("by_gameId_round",
                (q) => q.eq("gameId", args.gameId)
                    .eq("round", args.roundId)
            ).collect()

            const formatedRoundMessages = formatRoundMessages(roundMessages)
            console.log(formatedRoundMessages)

            return {
                roundData: formatedRoundMessages,
            }
        }
    }
)


export const readMonument = internalQuery({
    args: { gameId: v.id("games"), roundId: v.number() },
    handler: async (ctx, args) => {

        const round = await ctx.db.query("monuments")
            .withIndex("by_gameId_round",
                (q) => q.eq("gameId", args.gameId).eq("round", args.roundId)
            ).first()



        return {
            roundSummary: round?.epicStory, epicUrl: round?.epicImageUrl, imagePrompt: round?.imagePrompt
        }
    },
})


export const patchMonument = internalMutation({
    args : {
        monumentId:v.id("monuments"),
        epicStory:v.optional(v.string()),
        imagePrompt:v.optional(v.string()),
        epicImageUrl:v.optional(v.string())},

    handler: async (ctx, args) => {
        
        const patchedMonument :Partial<Doc<"monuments">> = {}

        if(args.epicStory !== null){
            patchedMonument.epicStory = args.epicStory
        }

        if(args.imagePrompt !== null){
            patchedMonument.imagePrompt = args.imagePrompt
        }

        if(args.epicImageUrl !==null){
            patchedMonument.epicImageUrl = args.epicImageUrl
        }

        await ctx.db.patch(args.monumentId,patchedMonument)

    },
})