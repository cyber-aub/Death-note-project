import GameOver from "@/components/game/GameOver";
import { makeServerSideRender } from "@/lib/locales";


export default function Page() {
    return (
        <GameOver/>
    )
}


export const getServerSideProps = makeServerSideRender