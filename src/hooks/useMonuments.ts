import { loadMonuments } from "@/stores/game/game-slice"
import { selectGameMonument } from "@/stores/game/selectors"
import { useAppDispatch, useAppSelector } from "@/stores/hooks"
import { api } from "@convex/_generated/api"
import { Id } from "@convex/_generated/dataModel"
import { useQuery } from "convex/react"
import { useEffect } from "react"


export const useLoadMonuments = (gameId:string) => {
    const monuments = useQuery(api.monuments.loadGameMonuments, { gameId: gameId as Id<"games"> })
    const dispatch = useAppDispatch()

    useEffect(() => {
        if ( monuments) {
            dispatch(loadMonuments(monuments))
        }
    }, [dispatch,  monuments])

    return monuments
}

export const useReadStoreGameMonument = () => {
    const monuments = useAppSelector(selectGameMonument)

    return monuments
}