import { kiraAvatar, lawlietAvatar } from "@/domain/constants"
import { useReadStoreIsKiraOrLawliet, useReadStorePlayersWithRevealedSecrets, useReadStoreRound } from "@/hooks/useGame"
import { useReadStoreLobbyPlayers } from "@/hooks/useLobby"
import { Avatar, Collapse, CollapseProps, Space, Typography } from "antd"
import useTranslation from 'next-translate/useTranslation'


export default function Secrets() {
    const { isKira, isLawliet, kiraId, lawlietId } = useReadStoreIsKiraOrLawliet()
    const round = useReadStoreRound()
    const lobbyPlayers = useReadStoreLobbyPlayers()
    const { t } = useTranslation("common")
    const playersWithRevealedSecrets = useReadStorePlayersWithRevealedSecrets()

    const renderSecrets = isKira || isLawliet

    const kiraOrLawlietsecrets: CollapseProps['items'] = []
    const players: CollapseProps['items'] = playersWithRevealedSecrets.map((player) => {
        const playerSecrets: CollapseProps['items'] = []

        for(let i = 5; i > player.revealedSecretsInReverse; i--) {
            playerSecrets.push({
                key: `secret-${player._id}-${i}`,
                label: <Typography.Title level={4}>{`${t('secret')} ${i}`}</Typography.Title>,
                children: <Typography.Paragraph>{player.player[`secret${i}` as keyof typeof player.player] as string}</Typography.Paragraph>,
            })
        }

        const secretsHeaderProps = {
            name: player.player.name,
            avatar: player.player.profilePicture
        }

        return {
            key: `secrets-${player._id}-${player.version}`,
            label: <SecretsHeader {...secretsHeaderProps}/>,
            children: <Collapse items={playerSecrets} expandIconPosition="end" />
        }
    })

    const targetPlayerId = isKira ? lawlietId : isLawliet ? kiraId : null

    if (targetPlayerId) {
        const targetPlayer = lobbyPlayers.find((player) => player.player.tokenIdentifier === targetPlayerId)!
        const key = isKira ? 'lawliet' : 'kira'
        for (let i = 1; i < round + 1; i++) {
            kiraOrLawlietsecrets.push({
                key: `secret-${key}-${i}`,
                label: <Typography.Title level={4}>{`${t('secret')} ${i}`}</Typography.Title>,
                children: <Typography.Paragraph>{targetPlayer.player[`secret${i}` as keyof typeof targetPlayer.player] as string}</Typography.Paragraph>,
            })
        }

        const secretsHeaderProps = {
            name: t(isKira ? 'lawliet' : 'kira'),
            avatar: isKira? lawlietAvatar:kiraAvatar 
        }
       

        players.push({
            key: `secretsWidget-${key}`,
            label: <SecretsHeader {...secretsHeaderProps}/>,
            children: <Collapse items={kiraOrLawlietsecrets} expandIconPosition="end" />
        })
    }

    const secretItems: CollapseProps['items'] = [
        {
            key: `secretsWidget`,
            label: <Typography.Title level={3}>{t('secrets')}</Typography.Title>,
            children: <Collapse items={players} expandIconPosition="end" />
        }
    ]

    return (
        renderSecrets ? <Collapse items={secretItems} expandIconPosition="end"/> : null
    )
    
}

interface SecretsHeaderProps {
    name: string,
    avatar: string
}

function SecretsHeader({ name, avatar }: SecretsHeaderProps) {

    return (
        <Space >
            <Avatar src={avatar} />
            <Typography.Title level={4} className="mb-0">{name}</Typography.Title>

        </Space>
    )
}