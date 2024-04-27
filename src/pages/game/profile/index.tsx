import Profile from "@/components/profile/Profile";
import { makeServerSideRender } from "@/lib/locales";


export default function Page() {
    return <Profile />
}

export const getServerSideProps = makeServerSideRender