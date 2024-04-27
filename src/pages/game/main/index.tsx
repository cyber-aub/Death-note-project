import MainMenu from "@/components/main-menu/MainMenu";
import { makeServerSideRender } from "@/lib/locales";
import ProfileInjector from "@/lib/stateLoaders/ProfileLoader";
import StateLoader from "@/lib/stateLoaders/StateLoader";

export default function Page() {

    return (
        <>
            <StateLoader injector={<ProfileInjector/>} />
            <MainMenu />

        </>
    )
}

export const getServerSideProps = makeServerSideRender
