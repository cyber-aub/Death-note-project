
import { useLoadRoundMessages } from "@/hooks/useChat"
import { Id } from "@convex/_generated/dataModel"


export default function ChatInjector({ gameId,round }: { gameId: string ,round:number}) {
    useLoadRoundMessages(round,gameId as Id<"games">)
    return null
}
