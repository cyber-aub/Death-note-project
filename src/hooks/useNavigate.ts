import { hostGamePath, joinGamePath, mainMenuPath, rulesPath, lobbyPath, gamePath, gameOverPath } from '@/domain/navigation'
import { settingsPath, logoutPath, profilePath, } from '@/domain/navigation'
import { Modal } from 'antd'
import { useRouter } from 'next/router'



interface NavigationHook {
    navigateHostGame: () => void,
    navigateJoinGame: () => void
    navigateSettings: () => void
    navigateLogout: () => void
    navigateRules: () => void,
    navigateMainMenu: () => void,
    navigateProfile: () => void,
    navigateLobby: (lobbyId: string) => void,
    navigateGame: (lobbyId: string) => void
    navigateGameOver: () => void

}

export function useNavigation(): NavigationHook {
    const router = useRouter()

    return {
        navigateHostGame: () => router.replace(hostGamePath),
        navigateJoinGame: () => router.replace(joinGamePath),
        navigateSettings: () => router.replace(settingsPath),
        navigateLogout: () => router.replace(logoutPath),
        navigateProfile: () => router.replace(profilePath),
        navigateRules: () => router.replace(rulesPath),
        navigateMainMenu: () => router.replace(mainMenuPath),
        navigateLobby: (lobbyId: string) => router.replace(lobbyPath + lobbyId),
        navigateGame: (lobbyId: string) => router.replace(gamePath + lobbyId),
        navigateGameOver: () => router.replace(gameOverPath)
    }
}


export const useFeedbackModal = () => {
    const [modal, contextHolder] = Modal.useModal();


    return {
        contextHolder,
        display: (content: string,statusCode?:number) => {

            let secondsToGo = 3;

            const instance = modal.info({
                title  :content,
            });


            setTimeout(() => {
                instance.destroy();
            }, secondsToGo * 1000);

        }
    }
}

export const useChangeLanguage = () => {
    const router = useRouter()


    return {
        changeLanguage : (locale : "en" |"fr") => {
            router.replace(router.pathname,undefined,{
                locale
            })
        },
        locale : router.locale
    }
}