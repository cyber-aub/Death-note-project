import { useReadStoreIsVoting, useReadStoreKandLids } from "@/hooks/useGame"
import { useReadStoreLobbyPlayers } from "@/hooks/useLobby"
import { useReadStorePlayerVoteStatus } from "@/hooks/useProfile"
import { useVote } from "@/hooks/useVote"
import { Doc } from "@convex/_generated/dataModel"
import { Avatar, Button, Typography, Col, Row, Space } from "antd"
import useTranslation from 'next-translate/useTranslation'
import { useState } from "react"


interface VoteProps {
    onActionResult: (message: string, errorCode?: number) => void
}
export default function Vote({ onActionResult }: VoteProps) {
    const { isVoting, gameId, } = useReadStoreIsVoting()
    const { playerId, version } = useReadStorePlayerVoteStatus()
    const { t } = useTranslation("common")


    const activePhaseProps = {
        kiraLabel: t("kira"),
        lawlietLabel: t("lawliet"),
        voteLabel: t("vote"),
        displayFeedback: onActionResult,
        voteSucessLabel: t("vote_sucess"),
        voteFailLabel: t("vote_fail"),
        noPlayerSelectedLabel: t("no_player_selected"),
        version,
        gameId,
        playerId
    }
    const inactivePhaseProps = {
        notVotingPhaseLabel: t("not_voting_phase"),
    }

    return (
        <div className="flex flex-row justify-center items-center w-96">

            {isVoting ? <VotingPhaseActive {...activePhaseProps} /> : <VotingPhaseInactive {...inactivePhaseProps} />
            }
        </div>


    )
}

interface VotingPhaseActiveProps {
    kiraLabel: string
    lawlietLabel: string
    voteLabel: string,
    gameId: string,
    playerId: string,
    voteSucessLabel: string,
    voteFailLabel: string,
    version: number,
    noPlayerSelectedLabel: string,
    displayFeedback: (message: string, errorCode?: number) => void
}
function VotingPhaseActive(props: VotingPhaseActiveProps) {
    const { kiraLabel, lawlietLabel, voteLabel } = props
    const { gameId, playerId, version,noPlayerSelectedLabel } = props
    const { displayFeedback, voteFailLabel, voteSucessLabel } = props
    const [isKira, setIsKira] = useState(false)
    const [targetPlayerId, setTargetPlayerId] = useState("")
    const vote = useVote({
        displayFeedback,
        sucessMessage: voteSucessLabel,
        failMessage: voteFailLabel,
    })
    const { kiraStatusId, lawlietStatusId } = useReadStoreKandLids()

    const lobbyPlayers = useReadStoreLobbyPlayers()

    const isVotingKira = () => {
        setIsKira(true)
    }

    const isVotingLawliet = () => {
        setIsKira(false)
    }

    const handleVote = () => {
        if (targetPlayerId === "") {
            displayFeedback(noPlayerSelectedLabel, 400)
            return
        }

        vote({
            gameId: gameId,
            playerId: playerId,
            targetStatusId: targetPlayerId,
            voteType: isKira ? "kira" : "lawliet",
            isKiraOrL: false,
            kiraStatusId,
            lawlietStatusId,
            version
        })
    }

    const buttonType = (kOrLbutton: "kira" | "lawliet") => {
        if (isKira && kOrLbutton === "kira") return "primary"
        if (!isKira && kOrLbutton === "lawliet") return "primary"
        return "default"
    }


    const PlayerButton = ({ player }: { player: Doc<"playersStatus"> }) => {
        const isSelected = player._id === targetPlayerId

        const select = () => {
            setTargetPlayerId(player._id)
        }

        const type = isSelected ? "primary" : "default"
        return (
            <Col className="w-full h-full" span={12} >
                <Button className="flex flex-col justify-evenly items-center w-full h-full p-4" type={type} onClick={select}

                    icon={
                        <Space size="middle" direction="vertical">
                            <Avatar size="large" src={player.player.profilePicture} />
                            <p>{player.player.name}</p>
                        </Space>
                    }
                />



            </Col>
        )
    }

    return (
        <Space className="w-full" direction="vertical">
            <div className="w-full flex flex-row justify-between items-center" >
                <Button className="w-full flex-1 mr-4" type={buttonType("kira")} onClick={isVotingKira}>{kiraLabel}</Button>
                <Button className="w-full flex-1" type={buttonType("lawliet")} onClick={isVotingLawliet}>{lawlietLabel}</Button>
            </div>

            <Row gutter={[16, 24]}>
                {lobbyPlayers.map((lobbyPlayer) => {
                    const key = `voting-${lobbyPlayer._id}}`
                    return <PlayerButton key={key} player={lobbyPlayer} />
                })}
            </Row>

            <Button className="w-full" onClick={handleVote} type="primary" >
                {voteLabel}
            </Button>
        </Space>
    )
}

interface VotingPhaseInactiveProps {
    notVotingPhaseLabel: string
}
function VotingPhaseInactive({ notVotingPhaseLabel }: VotingPhaseInactiveProps) {
    return (
        <Typography.Title level={4}>{notVotingPhaseLabel}</Typography.Title>
    )
}