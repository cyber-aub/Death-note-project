"use node";
import { v } from "convex/values";
import OpenAI from "openai";
import { api, internal } from "./_generated/api";
import { internalAction, } from "./_generated/server";
import { chatGptModel, chatGptsUserRole, chatGptSystemRoleEpic, chatGptSystemRoleEpicImage, } from "./_helpers/ai_helper";

const apiKey = process.env.OPENAI_API_KEY!;
const openai = new OpenAI({ apiKey });



export const generateGameMonuments = internalAction(
    {
        args: { gameId: v.id("games"), rounds: v.number() },
        handler: async (ctx, args) => {

            for (let i = 1; i <= args.rounds; i++) {
                const { monumentId, epicStory, epicImageUrl, imagePrompt } = await ctx.runMutation(internal.monuments.storeGameMonument, { gameId: args.gameId, roundId: i })
                const { roundData } = await ctx.runQuery(internal.monuments.compileRound, { gameId: args.gameId, roundId: i })

                let summary = epicStory
                if (!summary) {
                    const tSummary = await ctx.runAction(internal.ai.getRoundSummary, { roundData: roundData, monumentId })
                    if (tSummary !== null) {
                        summary = tSummary
                    }
                }

                let epicImagePrompt = imagePrompt
                if (!epicImagePrompt) {
                    const imagePrompt = await ctx.runAction(internal.ai.getRoundImagePrompt, { roundData: summary!,monumentId })
                    if (imagePrompt !== null) {
                        epicImagePrompt = imagePrompt
                    }
                }

                let imageUrl = epicImageUrl

                if (!imageUrl) {
                    const tImageUrl = await ctx.runAction(internal.ai.getRoundImage, { imagePrompt: epicImagePrompt! ,monumentId })
                    if (tImageUrl !== null) {
                        imageUrl = tImageUrl
                    }
                }
               
                await ctx.runMutation(internal.monuments.patchMonument,{
                    monumentId:monumentId,
                    epicStory : summary,
                    imagePrompt : epicImagePrompt,
                    epicImageUrl:imageUrl
                })

            }
        }
    }
)

export const getRoundSummary = internalAction(
    {
        args: { roundData: v.string(), monumentId:v.id("monuments"), },

        handler: async (ctx, args) => {

            const response = await openai.chat.completions.create({
                model: chatGptModel,
                messages: [
                    chatGptSystemRoleEpic,
                    chatGptsUserRole(args.roundData),
                ],
            });

            const responseContent = response.choices[0].message?.content;


            return responseContent


        },
    }
)

export const getRoundImagePrompt = internalAction(
    {
        args: { roundData: v.string(),monumentId:v.id("monuments"), },

        handler: async (ctx, args) => {

            const response = await openai.chat.completions.create({
                model: chatGptModel,
                messages: [
                    chatGptSystemRoleEpicImage,
                    chatGptsUserRole(args.roundData),
                ],
            });

            const responseContent = response.choices[0].message?.content;

            let prompt = "death note ultra portrait"

            if (responseContent !== null) {
                prompt = responseContent!.length < 1000 ? responseContent : responseContent!.substring(0, 1000)
                
            }
            return prompt


        },
    }
)

export const getRoundImage = internalAction({
    args: { imagePrompt: v.string(),monumentId:v.id("monuments"), },
    handler: async (ctx, args) => {

        const response = await openai.images.generate(
            {
                prompt: args.imagePrompt
            }
        )

        const imageUrl = response?.data[0]?.url

        

        return imageUrl
    }

})