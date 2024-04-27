import JoinGame from "@/components/host/JoinGame";
import { makeServerSideRender } from "@/lib/locales";



export default function Page(){
    return (
        <JoinGame/>
    )
}

export const getServerSideProps = makeServerSideRender