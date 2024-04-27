import { useStartGame, useTearDownGame } from "@/hooks/useGame";
import { useReadStoreLobby } from "@/hooks/useLobby";
import { useFeedbackModal } from "@/hooks/useNavigate";
import { useReadStoreProfile } from "@/hooks/useProfile";
import CopyOutlined from "@ant-design/icons/lib/icons/CopyOutlined";
import { Button, Card, Descriptions, DescriptionsProps, Space } from "antd";
import useTranslation from 'next-translate/useTranslation'
import { useEffect } from "react";
import LobbyPlayers from "./LobbyPlayers";





export default function Lobby() {
    const { t } = useTranslation("common")

    const lobby = useReadStoreLobby()
    const startGame = useStartGame()
    const cancelGame = useTearDownGame()
    const profile = useReadStoreProfile()

    const isGameMaster = lobby.hostId === profile.tokenIdentifier

    const { contextHolder, display: displayFeedbackModal } = useFeedbackModal()

    const LobbyIdTitle = () => {
        const copyContentToKeyboard = () => {
            navigator.clipboard.writeText(lobby._id)
            displayFeedbackModal(t("copy_sucess"))
        }

        return (
            <Space>
                <p>
                    {t("lobby_id")}
                </p>
                <Button onClick={copyContentToKeyboard} icon={<CopyOutlined style={{ fontSize: 14 }} />} />
            </Space>
        )
    }
    const items: DescriptionsProps['items'] = [
        {
            key: lobby._id,
            label: <LobbyIdTitle />,
            span: 3,
            children: <p>{lobby._id}</p>,
        }
    ]


    const onStartGame = () => {
        startGame({ lobbyId: lobby._id })
    }

    const onCancel = () => {
        cancelGame(
            {
                hostId: lobby.hostId,
                lobbyId: lobby._id,
                tokenIdentifier: profile.tokenIdentifier
            }
        )
    }

    useEffect(() => {
        if (lobby.gameStarted) {
            startGame({ lobbyId: lobby._id, gameStarted: true })
        }
    }, [lobby, startGame])

    return (
        <Card title={t('lobby')} className="min-w-96">
            <Space className="w-full" direction="vertical">

                <Descriptions layout="vertical" items={items} bordered />
                <LobbyPlayers  />
                <div className="flex flex-row justify-between w-full">
                    <Button htmlType="button" onClick={onCancel}>
                        {t('cancel')}
                    </Button>

                    {
                        isGameMaster ?
                            <Button type="primary" onClick={onStartGame}>
                                {t('start_game')}
                            </Button>
                            : null
                    }
                </div>
            </Space>
            {contextHolder}
        </Card>
    )
}