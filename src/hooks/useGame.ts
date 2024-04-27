import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { useAction, useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "@convex/_generated/api";
import { loadGame } from "@/stores/game/game-slice";
import { selectActions, selectGame,  selectGameWinner, selectIsKiraOrLawliet, selectIsVoting, selectKiraAndLalwietIds, selectPlayersWithRevealedSecrets } from "@/stores/game/selectors";
import { Id } from "@convex/_generated/dataModel";
import { useNavigation } from "./useNavigate";


export const useStartGame = () => {
    const startGame = useAction(api.game.startGame)
    const navigate = useNavigation()

    return ({ lobbyId, gameStarted }: { lobbyId: string, gameStarted?: boolean }) => {
        if (gameStarted) {
            navigate.navigateGame(lobbyId)
            return
        }
        startGame({ lobbyId: lobbyId as Id<"lobbies"> }).then((res) => navigate.navigateGame(lobbyId))
    }
}

export const useTearDownGame = () => {
    const tearDown = useAction(api.game.cleanupGame)
    const navigate = useNavigation()

    return (props: { gameId?: Id<"games">, tokenIdentifier: string, hostId: string, lobbyId: Id<"lobbies"> }) => {
        if (props.hostId !== props.tokenIdentifier) {
            navigate.navigateMainMenu()
            return
        }
        const tearDownProps = { gameId: props.gameId, lobbyId: props.lobbyId, hostId: props.hostId }
        tearDown({ ...tearDownProps }).then(() => navigate.navigateMainMenu())
    }
}

export const useLoadGame = (lobbyId: Id<"lobbies">) => {

    const game = useQuery(api.game.loadGame, { lobbyId })
    const dispatch = useAppDispatch()


    useEffect(() => {
        if (game) {
            dispatch(loadGame(game))
        }
    }, [dispatch, game])

    return game !== null && game !== undefined
}

export const useReadStoreGame = () => {
    const game = useAppSelector(selectGame)
    return game

}

export const useReadStoreIsVoting = () => {
    const isVoting = useAppSelector(selectIsVoting)
    return isVoting
}

export const useReadStoreIsKiraOrLawliet = () => {
    const kiraOrLawliet = useAppSelector(selectIsKiraOrLawliet)

    return kiraOrLawliet
}

export const useReadStoreRound = () => {
    const round = useAppSelector((state) => state.game.game.round)
    return round
}

export const useReadStoreAbillities = () => {
    const abillities = useAppSelector(selectActions)
    return abillities
}

export const useReadStoreKandLids = () => {
    const kiraAndLids = useAppSelector(selectKiraAndLalwietIds)
    return { ...kiraAndLids }
}

export const useReadStoreIsGameOver = () => {
    const gameOver = useAppSelector(selectGameWinner)
    return gameOver
}



export const useReadStorePlayersWithRevealedSecrets = () => {
    const players = useAppSelector(selectPlayersWithRevealedSecrets)
    
    return players
}