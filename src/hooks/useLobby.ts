import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import {  useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "@convex/_generated/api";
import { loadLobby, loadLobbyPlayers } from "@/stores/lobby/lobby-slice";
import { selectLobby } from "@/stores/lobby/selectors";
import { Id } from "@convex/_generated/dataModel";

export const useLoadLobby= (lobbyId:Id<"lobbies">) => {
    
    const lobby = useQuery(api.host.loadLobby, {lobbyId })
    const dispatch = useAppDispatch()


    useEffect(() => {
        if (lobby) {
            dispatch(loadLobby(lobby))
        }
    }, [dispatch,  lobby])

    return lobby !== null && lobby !== undefined
}
export const useLoadPlayers = (lobbyId:Id<"lobbies">) => {
    const res = useQuery(api.game.loadPlayersStatus, {lobbyId })
    const dispatch = useAppDispatch()


    useEffect(() => {
        if (res) {
            dispatch(loadLobbyPlayers(res.players))
        }

    }
    , [dispatch,  res])

    return res

}
export const useReadStoreLobby = () => {
    const lobby = useAppSelector(selectLobby)
    return lobby

}

export const useReadStoreLobbyPlayers = () => {
    const lobbyPlayers = useAppSelector(state => state.lobby.lobbyPlayers)
    return lobbyPlayers
}