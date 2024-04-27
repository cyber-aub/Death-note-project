import { useReadStoreGame } from "@/hooks/useGame";
import { useReadStorePlayerChatStatus } from "@/hooks/useChat";
import { Layout, Card } from "antd";
import useTranslation from 'next-translate/useTranslation'
import ChatMessages from "./ChatMessages";
import SendMessageButton from "./SendMessageButton";


export default function Chat() {
    const { t } = useTranslation("common")

    const game = useReadStoreGame()
    const {playerId,incapicated,avatar,name} = useReadStorePlayerChatStatus()

    const sendMessageProps = {
        kiraId: game.kiraId,
        lawlietId: game.lawlietId,
        playerId,
        round: game.round,
        incapicated,
        sendLabel: t("send"),
        sendKiraLabel: t("sendKira"),
        sendLawlietLabel: t("sendLawliet"),
        gameId: game._id,
        avatar,
        name,
    }

    return (

        <Layout className="max-w-lg">
            <Layout.Content>
                <Card bodyStyle={{ padding: "0.3rem", }}>
                    <ChatMessages round={game.round} gameId={game._id} />
                </Card>

            </Layout.Content>

            <Layout.Footer className="p-0 pt-2">
                <SendMessageButton {...sendMessageProps} />
            </Layout.Footer>
        </Layout>

    )
}
