import Settings from "@/components/settings/Settings";
import { makeServerSideRender } from "@/lib/locales";


export default function Page(){
    return <Settings />
}



export const getServerSideProps = makeServerSideRender