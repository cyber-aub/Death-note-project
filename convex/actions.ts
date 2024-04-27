import { v } from "convex/values";
import { internal } from "./_generated/api";
import { action, internalMutation } from "./_generated/server";


export const usePlayerAction = action(
    {
        args: {
            targetId: v.id("playersStatus"),
            userId: v.id("playersStatus"),
            actionType: v.string(),
            revealedSecretsInReverse: v.optional(v.number()),
            version: v.number(),
            gameId: v.id("games"),
            kiraStatusId : v.id("playersStatus"),
            lawlietStatusId : v.id("playersStatus"),
            round:v.number()
        },
        handler: async (ctx, args): Promise<{ executed: boolean }> => {
            
            const handleGameOver = async () => {
                const { gameOver, kiraWon, lawlietWon } = await ctx.runQuery(internal.game.checkIfGameOver, {
                    kiraStatusId: args.kiraStatusId,
                    lawlietStatusId: args.lawlietStatusId,
                })

                if (gameOver) {
                    const { gameId,round } = args
                    await ctx.runMutation(internal.game.endGame, { gameId, kiraWon, lawlietWon })
                    await ctx.runAction(internal.ai.generateGameMonuments, { gameId, rounds: round})
                }
            }

            let executed = false
            switch (args.actionType) {
                case "kill":
                    executed = await ctx.runMutation(internal.actions.kill, { target: args.targetId, version: args.version });
                    if(executed) {await handleGameOver()}
                    break;
                case "jail":
                    executed = await ctx.runMutation(internal.actions.jail, { target: args.targetId, version: args.version });
                    if(executed) {await handleGameOver()}
                    break;
                case "investigate":
                    executed = await ctx.runMutation(internal.actions.investigate, { target: args.targetId, version: args.version, revealedSecretsInReverse: args.revealedSecretsInReverse ?? 5 });
                    break;
                case "protectKira":
                    executed = await ctx.runMutation(internal.actions.protect, { target: args.targetId, version: args.version, userId: args.userId, meterType: "k" });
                    break;

                default:
                    executed = await ctx.runMutation(internal.actions.protect, { target: args.targetId, version: args.version, userId: args.userId, meterType: "l" });
                    break;
            }

            await ctx.runMutation(internal.actions.updateRemainingActions, {
                userId: args.userId,
                remainingActions: 0,
            })

            return {
                executed,
            }
        }
    }
)

export const protect = internalMutation({
    args: {
        target: v.id("playersStatus"),
        meterType: v.string(),
        userId: v.id("playersStatus"),
        version: v.number()
    },
    handler: async (ctx, args) => {

        const upadtedFields: {
            kiraMeter?: number,
            lawlietMeter?: number
        } = {
            kiraMeter: undefined,
            lawlietMeter: undefined
        }

        if (args.meterType === "k") {
            upadtedFields.kiraMeter = -5
            delete upadtedFields.lawlietMeter
        }

        if (args.meterType === "l") {
            upadtedFields.lawlietMeter = -5
            delete upadtedFields.kiraMeter
        }

        return ctx.db.patch(args.target, upadtedFields).then(() => {
            return true
        })
            .catch(() => {
                return false
            })

    }
})

export const kill = internalMutation({
    args: {
        target: v.id("playersStatus"),
        version: v.number()
    },
    handler: async (ctx, args) => {
        return ctx.db.patch(args.target, { alive: false })
            .then(() => {
                return true
            })
            .catch(() => {
                return false
            })
    }
})

export const jail = internalMutation({
    args: {
        target: v.id("playersStatus"),
        version: v.number()
    },
    handler: async (ctx, args) => {
        return ctx.db.patch(args.target, { jailed: true }).then(() => {
            return true
        })
            .catch(() => {
                return false
            })
    }
})

export const investigate = internalMutation({
    args: {
        target: v.id("playersStatus"), revealedSecretsInReverse: v.number(),
        version: v.number()
    },
    handler: async (ctx, args) => {
        return ctx.db.patch(args.target, { revealedSecretsInReverse: args.revealedSecretsInReverse - 1 }).then(() => {
            return true
        })
            .catch(() => {
                return false
            })
    }
})

export const updateRemainingActions = internalMutation({
    args: { userId: v.id("playersStatus"), remainingActions: v.number() },
    handler: async (ctx, args) => {
        ctx.db.patch(args.userId, { remainingActions: args.remainingActions }).then(() => {
            return true
        })
            .catch(() => {
                return false
            })
    }
})

export const replenishActions = internalMutation({
    args: { lobbyId: v.id("lobbies") },
    handler: async (ctx, args) => {
        const players = await ctx.db.query("playersStatus").withIndex
            ("by_lobbyId_playerId",
                (q) => q.eq("lobbyId", args.lobbyId)
            )
            .collect()

        for (const player of players) {
            await ctx.db.patch(player._id, { remainingActions: 1 })
        }
    }
})