import Lobby from "@/components/lobby/Lobby";
import { makeServerSideRender } from "@/lib/locales";
import LobbyInjector from "@/lib/stateLoaders/LobbyLoader";
import StateLoader from "@/lib/stateLoaders/StateLoader";
import { useRouter } from "next/router";


export default function Page(){
    const router = useRouter()
    const lobbyId = router.query.lobbyId as string

    return (
        <>
        <StateLoader injector={<LobbyInjector lobbyId={lobbyId}/>}/>

        <Lobby  />
        </>
    )
}



export const getServerSideProps = makeServerSideRender