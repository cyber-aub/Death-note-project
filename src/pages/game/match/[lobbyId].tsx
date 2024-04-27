import Game from "@/components/game/Game"
import { makeServerSideRender } from "@/lib/locales"
import GameInjector from "@/lib/stateLoaders/GameLoader"
import StateLoader from "@/lib/stateLoaders/StateLoader"
import { useRouter } from "next/router"


export default function Page() {
    const router = useRouter()
    const lobbyId = router.query.lobbyId as string

    return (
        <>
            <StateLoader injector={<GameInjector lobbyId={lobbyId} />} />
            <Game />

        </>
    )
}


export const getServerSideProps = makeServerSideRender