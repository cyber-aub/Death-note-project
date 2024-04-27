import { loadChat } from "@/stores/game/game-slice"
import { selectChat, selectPlayerChatStatus } from "@/stores/game/selectors"
import { useAppDispatch, useAppSelector } from "@/stores/hooks"
import { api } from "@convex/_generated/api"
import { Id } from "@convex/_generated/dataModel"
import { useMutation, useQuery } from "convex/react"
import { useEffect } from "react"


export const useLoadRoundMessages = (round: number, gameId: Id<"games">) => {
    const chat = useQuery(api.chat.loadRoundMessages, { round, gameId })

    const dispatch = useAppDispatch()


    useEffect( () => {
        if (chat && chat.length > 0) {
            dispatch(loadChat(chat))
        }
    }, [dispatch, chat])

}

interface SendMessageProps {
    message: string,
    isKira: boolean,
    isLawliet: boolean,
    gameId: Id<"games">,
    round: number,
    avatar: string,
    name: string,
}
export const useSendMessage = () => {
    const sendMessage = useMutation(api.chat.sendMessage)

    return (props: SendMessageProps) => {
        sendMessage({...props})
    }
}

export const useReadStoreChat = (round: number) => {
    const chat = useAppSelector((state) => selectChat({ ...state, round }))
    return chat
}

export const useReadStorePlayerChatStatus = () => {
    const status = useAppSelector(selectPlayerChatStatus)
    return status
}
