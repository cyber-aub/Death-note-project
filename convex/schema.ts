import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export const databaseTables = {
    games : "games",
    players : "players",
    lobbies : "lobbies",
    publicMessages : "publicMessages",
    privateMessages : "privateMessages",
    playersStatus : "playersStatus",
    monuments : "monuments",
}


export const PlayerSchema = {
    tokenIdentifier: v.string(),
    name: v.string(),
    secret1: v.string(),
    secret2: v.string(),
    secret3: v.string(),
    secret4: v.string(),
    secret5: v.string(),
    background: v.string(),
    profilePicture: v.string(),
}

export const PlayerStatusScehma = {
    lobbyId: v.id("lobbies"),
    playerId: v.string(),
    player: v.object(PlayerSchema),
    kiraMeter: v.number(),
    lawlietMeter: v.number(),
    ready: v.boolean(),
    name:v.optional(v.string()),
    remainingActions: v.number(),
    alive: v.boolean(),
    jailed: v.boolean(),
    revealedSecretsInReverse: v.number(), 
    version: v.number(),
}
export const VoteSchema = {
    playerId: v.string(),
    targetId: v.id("playersStatus"),
    voteType: v.string(),
    voteImpact : v.number(),
}

export const GameSchema = {
    hostId: v.string(),
    lobbyId : v.id("lobbies"),
    kiraId: v.string(),
    lawlietId: v.string(),
    roundTimerInSeconds: v.number(),
    round: v.number(),
    playerIds: v.array(v.string()),
    roundStartTimestamp: v.number(),
    roundVotes: v.array(v.object(VoteSchema)),
    isVoting: v.boolean(),
    kiraWon: v.boolean(),
    lawlietWon: v.boolean(),
    gameOver: v.boolean(),
}

export const LobbySchema = {
    hostId: v.string(),
    password: v.string(),
    maxPlayers: v.number(),
    playersCount : v.number(),
    gameStarted: v.boolean(),
    roundTimerInSeconds: v.number(),
    playerIds: v.array(v.string()),
}


export const PublicMessagesSchema = {
    gameId: v.id(databaseTables.games),
    message: v.string(),
    author: v.string(),
    senderId: v.string(),
    avatar: v.string(),
    round: v.number(),
}



export const GameMonumentsSchema = {
    round: v.number(),
    gameId: v.id(databaseTables.games),
    epicStory: v.optional(v.string()),
    imagePrompt :v.optional(v.string()),
    epicImageUrl: v.optional(v.string()),
}








const lobbies = defineTable(LobbySchema).index("by_hostId", ["hostId"]);
const games = defineTable(GameSchema).index("by_lobbyId", ["lobbyId"]);
const players = defineTable(PlayerSchema).index("by_token", ["tokenIdentifier"]);
const chat = defineTable(PublicMessagesSchema).index("by_gameId_round", ["gameId","round"]);
const playersStatus = defineTable(PlayerStatusScehma).index("by_lobbyId_playerId", ["lobbyId","playerId"]);
const monuments = defineTable(GameMonumentsSchema).index("by_gameId_round", ["gameId","round"]);

export default defineSchema({
    players,
    chat,
    lobbies,
    games,
    playersStatus,
    monuments
});