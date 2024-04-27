import useTranslation from 'next-translate/useTranslation'
import { Button, Space, Typography } from 'antd';
import { useNavigation } from '@/hooks/useNavigate';
import Logo from '@/components/commons/Logo';
import { useClerk } from "@clerk/clerk-react";


export default function MainMenu() {
    const { signOut } = useClerk();
    const { t } = useTranslation("common");
    const { Title } = Typography;

    const navigation = useNavigation()

    function toLogout() {
        signOut()
    }

    function toHostGame() {
        navigation.navigateHostGame()
    }

    function toJoinGame() {
        navigation.navigateJoinGame()
    }

    function toSettings() {
        navigation.navigateSettings()
    }

    function toRules() {
        navigation.navigateRules()
    }

    function toProfile() {
        navigation.navigateProfile()
    }

    return (
        <Space direction="vertical" size="middle" className="flex items-center ">
            <Logo />
            <Button onClick={toHostGame} className="flex flex-col justify-center items-center" type="text" size="large">
                <Title className="mb-0" level={2} type={'secondary'}>
                    {t('create_game')}
                </Title>
            </Button>
            <Button onClick={toJoinGame} className="flex flex-col justify-center items-center" type="text" size="large">
                <Title className="mb-0" level={2} type={'secondary'}>
                    {t('connect_game')}
                </Title>
            </Button>
            <Button onClick={toRules} className="flex flex-col justify-center items-center" type="text" size="large">
                <Title className="mb-0" level={2} type={'secondary'}>
                    {t('rules')}
                </Title>
            </Button>
            <Button onClick={toProfile} className="flex flex-col justify-center items-center" type="text" size="large">
                <Title className="mb-0" level={2} type={'secondary'}>
                    {t('profile')}
                </Title>
            </Button>
            <Button onClick={toSettings} className="flex flex-col justify-center items-center" type="text" size="large">
                <Title className="mb-0" level={2} type={'secondary'}>
                    {t('settings')}
                </Title>
            </Button>
            <Button onClick={toLogout} className="flex flex-col justify-center items-center" type="text" size="large">
                <Title className="mb-0" level={2} type={'secondary'}>
                    {t('logout')}
                </Title>
            </Button>
        </Space>
    )
}