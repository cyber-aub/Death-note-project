import { useNavigation, useChangeLanguage } from "@/hooks/useNavigate";
import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { selectThemeMode } from "@/stores/settings/selectors";
import { toggleTheme } from "@/stores/settings/settings-slice";
import { Button, Card,  Select, Space, Typography } from "antd";
import useTranslation from 'next-translate/useTranslation'


export default function Settings() {
    const { t } = useTranslation("common")
    const navigation = useNavigation()
    const { changeLanguage, locale } = useChangeLanguage()

    const dispatch = useAppDispatch()
    const isDarkTheme = useAppSelector(selectThemeMode)

    const supportedLanguages = [
        { value: 'en', label: t("english") },
        { value: 'fr', label: t("french") },
    ]

    const handleToggleTheme = () => {
        dispatch(toggleTheme())
    }

    const handleLanguageChange = (locale: string) => {
        changeLanguage(locale as "fr" | "en")
    }

    return (
        <div className="w-screen h-screen flex flex-row">
            <Card className="h-full w-40 flex flex-col items-center justify-center">
                <Button className="w-full" htmlType="button" onClick={navigation.navigateMainMenu}>
                    {t("mainMenu")}
                </Button>
            </Card>
            <div className="p-4">
            <Space direction="vertical">
                <Card>

                    <Space align="center">
                        <Typography.Title level={4}>{t(isDarkTheme ? "dark_theme" : "light_theme")} : </Typography.Title>
                        <Button size="large" onClick={handleToggleTheme}>{t("swap_theme")}</Button>
                    </Space>
                </Card>
                <Card>

                    <Space align="center">
                        <Typography.Title level={4}>{t("language")}: </Typography.Title>
                        <Select
                            defaultValue={locale}
                            style={{ width: 120 }}
                            onChange={handleLanguageChange}
                            options={supportedLanguages}
                        />
                    </Space>
                </Card>
            </Space>
            </div>
        </div>
    )
}


