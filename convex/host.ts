import { v } from "convex/values";
import { action, internalMutation, internalQuery, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Doc, Id } from "./_generated/dataModel";
import { ReadLobbyResponse } from "./_types/host";
import { playerAlreadyJoined } from "./_helpers/helpers";
import { gameAlreadyStartedCode, joinedLobbyCode, lobbyFullCode, playerAlreadyInLobbyCode, wrongPasswordCode } from "./_helpers/statusCodes";

const hostGameArgs = {
  hostId: v.string(),
  password: v.string(),
  maxPlayers: v.optional(v.number()),
  roundTimerInSeconds: v.optional(v.number()),
}

export const createLobby = internalMutation({
  args: hostGameArgs,
  handler: async (ctx, args): Promise<Id<"lobbies">> => {

    const lobby = {
      hostId: args.hostId,
      password: args.password,
      maxPlayers: args.maxPlayers ?? 5,
      playersCount: 1,
      gameStarted: false,
      roundTimerInSeconds: args.roundTimerInSeconds ?? 360,
      playerIds: [args.hostId],
    }

    const lobbyId = await ctx.db.insert("lobbies", lobby);

    return lobbyId;
  },
});

export const hostAlreadyExists = internalQuery({
  args: { hostId: v.string() },
  handler: async (ctx, args) => {
    const lobby = await ctx.db.query("lobbies")
      .filter((q) => q.eq(q.field("hostId"), args.hostId))
      .first();

    return lobby?._id
  }
})

export const hostGame = action({
  args: hostGameArgs,
  handler: async (ctx, args): Promise<Id<"lobbies">> => {

    const lobbyExistsId = await ctx.runQuery(internal.host.hostAlreadyExists, { hostId: args.hostId })

    if (lobbyExistsId) {
      return lobbyExistsId
    }

    const lobbyId = await ctx.runMutation(internal.host.createLobby, args)

    await ctx.runMutation(internal.host.addPlayerToLobby, {
      lobbyId: lobbyId,
      playerId: args.hostId,
      playerIds: []
    })

    return lobbyId

  },
});

export const loadLobby = query({
  args: { lobbyId: v.id("lobbies") },
  handler: async (ctx, args): Promise<ReadLobbyResponse> => {

    const lobby = await ctx.db.query("lobbies")
      .filter((q) => q.eq(q.field("_id"), args.lobbyId))
      .first();

    let players = null;

    if (lobby) {
      players = await ctx.db.query("playersStatus").
        filter((q) => q.eq(q.field("lobbyId"), lobby._id))
        .collect()
    }

    return { lobby, players };
  }
})


export const readLobbyPlayers = internalQuery({
  args: {
    lobbyId: v.id("lobbies"),
  },
  handler: async (ctx, args) => {

    let players = await ctx.db.query("playersStatus").
      filter((q) => q.eq(q.field("lobbyId"), args.lobbyId))
      .collect();



    return players
  }


})

export const readLobby = internalQuery({
  args: {
    lobbyId: v.id("lobbies"),
    password: v.optional(v.string()),
    byPassPassword: v.optional(v.boolean()),
  },
  handler: async (ctx, args): Promise<Doc<"lobbies"> | null> => {

    let lobby: Doc<"lobbies"> | null = null;

    if (args.byPassPassword) {
      lobby = await ctx.db.query("lobbies")
        .filter((q) => q.eq(q.field("_id"), args.lobbyId), )
        .first();
    }
    else {

      lobby = await ctx.db.query("lobbies")
        .filter((q) => q.and(q.eq(q.field("_id"), args.lobbyId), q.eq(q.field("password"), args.password)))
        .first();
    }



    return lobby;
  },
})

export const addPlayerToLobby = internalMutation({
  args: {
    lobbyId: v.id("lobbies"),
    playerId: v.string(),
    playerIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {

    const player = (await ctx.db.query("players").filter((q) => q.eq(q.field("tokenIdentifier"), args.playerId)).first())!

    const data = { ...player, _id: undefined, _creationTime: undefined }

    await ctx.db.insert("playersStatus", {
      lobbyId: args.lobbyId,
      playerId: args.playerId,
      player: data,
      ready: false,
      kiraMeter: 0,
      lawlietMeter: 0,
      remainingActions: 1,
      alive: true,
      jailed: false,
      revealedSecretsInReverse: 6,
      version: 0,
    })

    const playerIds = [...args.playerIds, args.playerId]
    await ctx.db.patch(args.lobbyId, {
      playerIds,
      playersCount: playerIds.length,
    })

  },
})

export const joinGame = action({
  args: {
    lobbyId: v.id("lobbies"),
    password: v.string(),
  },
  handler: async (ctx, args): Promise<
    {
      status: number,
      message: string,
      lobby: Doc<"lobbies"> | null,
    }> => {

    const lobbyArgs = {
      lobbyId: args.lobbyId,
      password: args.password,
    }

    const user = await ctx.auth.getUserIdentity()

    if (!user) {
      throw new Error("user not logged in")
    }

    const playerId = user.tokenIdentifier

    const lobby = await ctx.runQuery(internal.host.readLobby, lobbyArgs);

    const canJoinLobby = (() => {
      let status = joinedLobbyCode
      let message = "joined the lobby"

      status = !lobby ? 400 : status
      message = !lobby ? "lobby doesn't exist" : message

      if (lobby) {
        const lobbyFull = lobby.playersCount === lobby.maxPlayers
        status = lobbyFull ? lobbyFullCode : status
        message = lobbyFull ? "lobby full" : message

        status = lobby.gameStarted ? gameAlreadyStartedCode : status
        message = lobby.gameStarted ? "game already started" : message

        const wrongPassword = lobby.password.toLowerCase() !== args.password.toLowerCase()
        status = wrongPassword ? wrongPasswordCode : status
        message = wrongPassword ? "wrong passowrd" : message

        if(playerAlreadyJoined({playerId,playerIds:lobby.playerIds})){
          status = playerAlreadyInLobbyCode
          message = "player already joined"
        }
      }

      return {
        status,
        message,
      }
    })
      ()

    const isHostMaster = lobby?.hostId === playerId
    if (canJoinLobby.status === joinedLobbyCode && !isHostMaster) {
      await ctx.runMutation(internal.host.addPlayerToLobby, {
        playerId: playerId,
        lobbyId: lobby!._id,
        playerIds: lobby!.playerIds
      })

    }


    return {
      ...canJoinLobby,
      lobby
    };
  },
});


export const deleteLobby = internalMutation({
  args: { lobbyId: v.id("lobbies") },
  handler: async (ctx, args) => {

    ctx.db.delete(args.lobbyId);

    const playersStatus = await ctx.db.query("playersStatus").filter((q) => q.eq(q.field("lobbyId"), args.lobbyId)).collect();

    playersStatus.forEach(async (playerStatus) => {
      await ctx.db.delete(playerStatus._id);
    })



  },
});


export const updatePlayerReadyStatus = mutation({
  args: { id: v.id("playersStatus"), ready: v.boolean() },
  handler: async (ctx, args) => {
    const playerId = await ctx.auth.getUserIdentity()

    if (!playerId) {
      throw new Error("user not logged in")
    }
    const { id, ready } = args

    await ctx.db.patch(id, { ready });

  }
})