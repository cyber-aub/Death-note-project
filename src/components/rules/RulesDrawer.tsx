
import { useNavigation } from "@/hooks/useNavigate"
import { Card, Space, Button } from "antd"
import useTranslation from 'next-translate/useTranslation'

interface RulesDrawerProps {
    onClick: (key: string) => void,
    selectedKey: string
}
export default function RulesDrawer({onClick,selectedKey}: RulesDrawerProps) {
    const { t } = useTranslation('rules')

    const sections = [{ label: t('general'), key: "generalRulesArray" }, { label: t('kira'), key: "kiraRulesArray" }, { label: t('lawliet'), key: "lawlietRulesArray" }, { label: t('neutral'), key: "neutralRulesArray" }]
    const navigation = useNavigation()
    
    const goBack = () => {
        navigation.navigateMainMenu()
    }

    return (
        <Card className="h-full w-40 flex flex-col items-center justify-center">
            <Space className="h-full w-full" direction="vertical">
                {
                    sections.map((section) => {
                        const key = section.key + "Section"
                        const type = section.key === selectedKey ? "primary" : "default"
                        return (
                            <Button className="w-full" type={type}  onClick={() => onClick(section.key)} key={key}>{section.label}</Button>
                        )
                    })
                }
                <Button className="w-full" onClick={goBack}>{t("mainMenu")}</Button>
            </Space>
        </Card>
    )
}