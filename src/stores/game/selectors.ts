import { createSelector } from "@reduxjs/toolkit";
import { selectLobbyPlayers } from "../lobby/selectors";
import { RootState } from "../store";

const selectMonuments = (state: RootState) => state.game.monuments;
export const selectGame = (state: RootState) => state.game.game;
export const selectAllRoundsChat = (state: RootState) => state.game.chat;
export const selectRound = ({ round }: { round: number }) => round
export const selectRoundVotes = (state: RootState) => state.game.game.roundVotes;
const selectProfile = (state: RootState) => state.profile.profile;
const selectPlayers = (state: RootState) => state.lobby.lobbyPlayers;

export const selectIsKiraOrLawliet = createSelector(
    [selectGame, selectProfile], (game, profile) => {
        const kiraId = game.kiraId
        const lawlietId = game.lawlietId
        const playerId = profile.tokenIdentifier

        return {
            kiraId,
            lawlietId,
            playerId,
            isKira: kiraId === playerId,
            isLawliet: lawlietId === playerId
        }
    }
)

export const selectIsVoting = createSelector(
    [selectGame], (game) => {
        return {
            isVoting: game.isVoting,
            gameId: game._id
        }
    }
)

export const selectChat = createSelector(
    [selectAllRoundsChat, selectRound], (chat, round) => {
        const chatRound = chat[round]

        return chat[round] !== undefined ? chatRound : []
    },
)


export const selectActions = createSelector(
    [selectPlayers, selectProfile, selectGame], (players, profile, game) => {
        const playerId = profile.tokenIdentifier

        const userId = players.find(player => player.playerId === playerId)!._id!

        const actionsCount = players.find(player => player.playerId === playerId)?.remainingActions ?? 0

        const isKira = game.kiraId === playerId
        const isLawliet = game.lawlietId === playerId
        const isNeutral = !isKira && !isLawliet

        return {
            isKira,
            isLawliet,
            isNeutral,
            actionsCount,
            userId
        }

    }
)

export const selectKiraAndLalwietIds = createSelector(
    [selectGame, selectLobbyPlayers], (game, playersStatus) => {
        const kiraId = game.kiraId
        const lawlietId = game.lawlietId

        const kiraStatusId = playersStatus.find(player => player.playerId === kiraId)!._id
        const lawlietStatusId = playersStatus.find(player => player.playerId === lawlietId)!._id

        return {
            kiraId,
            lawlietId,
            kiraStatusId,
            lawlietStatusId,
            gameId: game._id,
            round: game.round
        }
    }
)

export const selectGameWinner = createSelector(
    [selectGame], (game) => {
        return {
            gameOver: game.gameOver,
            kiraWon: game.kiraWon,
            lawlietWon: game.lawlietWon,
            gameId: game._id
        }
    }
)

export const selectGameMonument = createSelector(
    [selectLobbyPlayers, selectGame, selectMonuments], (lobbyPlayers, game, monuments) => {

        const kira = lobbyPlayers.find(player => player.playerId === game.kiraId)!
        const lawliet = lobbyPlayers.find(player => player.playerId === game.lawlietId)!

        const players = lobbyPlayers.filter(player => {
            return player.playerId !== game.kiraId && player.playerId !== game.lawlietId
        })

        return {
            players,
            kira,
            lawliet,
            kiraWon: game.kiraWon,
            lawlietWon: game.lawlietWon,
            monuments,
            gameId: game._id
        }
    }

)

export const selectPlayerVoteStatus = createSelector(
    [selectProfile, selectLobbyPlayers], (profile, players) => {
        const playerId = profile.tokenIdentifier

        const player = players.find(player => player.playerId === playerId)!


        return {
            version: player.version,
            playerId
        }
    }
)

export const selectPlayersWithRevealedSecrets = createSelector(
    [selectLobbyPlayers], (players) => {

        const playersWithRevealedSecrets = players.filter(player => player.revealedSecretsInReverse < 6)



        return playersWithRevealedSecrets.length > 0 ? playersWithRevealedSecrets : []
    }
)

export const selectPlayerChatStatus = createSelector(
    [selectProfile, selectLobbyPlayers], (profile, players) => {
        const playerId = profile.tokenIdentifier

        const player = players.find(player => player.playerId === playerId)!

        return {
            avatar: profile.profilePicture,
            name: profile.name,
            playerId,
            incapicated: player.alive === false || player.jailed === true, 
        }

    }
)