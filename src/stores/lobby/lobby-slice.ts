import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Doc, Id } from '@convex/_generated/dataModel'
import { ReadLobbyResponse } from '@convex/_types/host'



export interface LobbyState {
    lobby: Doc<"lobbies">,
    lobbyPlayers: Doc<"playersStatus">[]
}

const initialState: LobbyState = {
    lobby: {
        hostId: "",
        password: "",
        maxPlayers: 0,
        playersCount: 0,
        gameStarted: false,
        playerIds: [],
        roundTimerInSeconds: 360,
        _id: "" as Id<"lobbies">,
        _creationTime: 0
    },
    lobbyPlayers: []
}

export const lobbySlice = createSlice({
    name: 'lobby',
    initialState,
    reducers: {
        loadLobby: (state, action: PayloadAction<ReadLobbyResponse>) => {
            if (action.payload.lobby) {
                state.lobby = action.payload.lobby
            }

            if (action.payload.players) {
                state.lobbyPlayers = action.payload.players
            }


        },
        loadLobbyPlayers: (state, action: PayloadAction<Doc<"playersStatus">[]>) => {
            state.lobbyPlayers = action.payload

        }
    },
})

export const { loadLobby,loadLobbyPlayers } = lobbySlice.actions

export default lobbySlice.reducer