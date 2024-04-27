import { useNavigation } from "@/hooks/useNavigate"
import { useEffect } from "react"


export default function Page() {
    const navigation = useNavigation()

    useEffect(() => {
        navigation.navigateMainMenu()
    }, [navigation])

    return (
        <></>
    )
}
