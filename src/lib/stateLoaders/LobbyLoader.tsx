import { useLoadLobby } from "@/hooks/useLobby"
import { Id } from "@convex/_generated/dataModel"

export default function LobbyInjector({lobbyId}: {lobbyId: string}){
    useLoadLobby(lobbyId as Id<"lobbies">)
    return null
}

