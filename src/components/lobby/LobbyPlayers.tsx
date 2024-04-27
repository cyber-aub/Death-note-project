import { useReadStoreProfile } from "@/hooks/useProfile";
import { useUpdateReadyStatus } from "@/lib/sdk";
import { Doc } from "@convex/_generated/dataModel"
import {  Checkbox, Descriptions, DescriptionsProps } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";
import useTranslation from 'next-translate/useTranslation'
import {  useReadStoreLobbyPlayers } from "@/hooks/useLobby";



export default function LobbyPlayers() {
    const players = useReadStoreLobbyPlayers()


    const profile = useReadStoreProfile()

    const items: DescriptionsProps['items'] = players.map((player) => {
        const isPlayer = player.playerId === profile.tokenIdentifier
        const Widget = isPlayer ? MyPlayerItem : OtherPlayerItem

        return {
            key: `${player.playerId}-${player.ready}`,
            label: player.player.name,
            children: <Widget playerStatus={player} />,
        }
    })

    return (

        <Descriptions bordered column={1} items={items} />




    )
}

interface LobbyPlayerItemProps {
    playerStatus: Doc<"playersStatus">,
}
function MyPlayerItem({ playerStatus }: LobbyPlayerItemProps) {
    const updateStatus = useUpdateReadyStatus(playerStatus._id)

    const updateReadyStatus = (e: CheckboxChangeEvent) => {
        updateStatus(e.target.checked)
    }

    return (
        <Descriptions.Item label={playerStatus.player.name}>
            <Checkbox defaultChecked={playerStatus.ready} onChange={updateReadyStatus} />
        </Descriptions.Item>

    )
}

function OtherPlayerItem({ playerStatus }: LobbyPlayerItemProps) {
    console.log(playerStatus.ready)
    return (
        <Descriptions.Item label={playerStatus.player.name}>
            <Checkbox defaultChecked={playerStatus.ready} disabled />
        </Descriptions.Item>
    )
}