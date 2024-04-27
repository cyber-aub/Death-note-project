import { useLoadGame } from "@/hooks/useGame"
import { Id } from "@convex/_generated/dataModel"


export default function GameInjector({ lobbyId }: { lobbyId: string }) {
    useLoadGame(lobbyId as Id<"lobbies">)
    return null
}
