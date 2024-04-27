import HostCreator from "@/components/host/HostCreator"
import { makeServerSideRender } from "@/lib/locales"

export default function Page(){
    return (
       <HostCreator/>
    )
}


export const getServerSideProps = makeServerSideRender