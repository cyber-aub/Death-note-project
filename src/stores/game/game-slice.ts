import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { Doc, Id } from '@convex/_generated/dataModel'


interface ChatMap { [key: number]: Doc<"chat">[] }
export interface LobbyState {
    game: Doc<"games">,
    chat: ChatMap,
    monuments : Doc<"monuments">[]
}

const initialState: LobbyState = {
    game: {
        _id: "" as Id<"games">,
        _creationTime: 0,
        kiraId: "",
        lawlietId: "",
        hostId: "",
        roundStartTimestamp: 0,
        isVoting: false,
        roundVotes: [],
        roundTimerInSeconds: 360,
        round: 1,
        lobbyId: "" as Id<"lobbies">,
        playerIds: [],
        kiraWon: false,
        lawlietWon: false,
        gameOver: false,
    },
    chat: {},
    monuments: []
}

export const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        loadGame: (state, action: PayloadAction<Doc<"games">>) => {
            state.game = action.payload
        },
        loadChat: (state, action: PayloadAction<Doc<"chat">[]>) => {
            const key = action.payload[0].round

            state.chat[key] = action.payload
        },
        addMessage: (state, action: PayloadAction<Doc<"chat">>) => {
            const key = action.payload.round
            state.chat[key].push(action.payload)
        },
        loadMonuments: (state, action: PayloadAction<Doc<"monuments">[]>) => {
            state.monuments = action.payload
        }
    },
})

export const { loadGame, loadChat, addMessage,loadMonuments } = gameSlice.actions

export default gameSlice.reducer