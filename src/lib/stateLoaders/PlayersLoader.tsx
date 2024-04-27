import { useLoadPlayers } from "@/hooks/useLobby"
import { Id } from "@convex/_generated/dataModel"

export default function PlayersInjector({lobbyId}: {lobbyId: string}){
    useLoadPlayers(lobbyId as Id<"lobbies">)
    return null
}

