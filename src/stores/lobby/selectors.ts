import { RootState } from "../store";


export const selectLobby = (state: RootState) => state.lobby.lobby;
export const selectLobbyPlayers = (state: RootState) => state.lobby.lobbyPlayers;