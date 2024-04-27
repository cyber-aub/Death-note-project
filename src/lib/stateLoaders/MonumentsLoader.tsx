import { useLoadMonuments } from "@/hooks/useMonuments"
import { Id } from "@convex/_generated/dataModel"

export default function MonumentsInjector({ gameId }: { gameId: string }) {
    useLoadMonuments(gameId as Id<"games">)
    return null
}

