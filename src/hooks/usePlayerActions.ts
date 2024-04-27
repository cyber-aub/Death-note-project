import { api } from "@convex/_generated/api"
import { Id } from "@convex/_generated/dataModel"
import { useAction } from "convex/react"
import { useReadStoreKandLids } from "./useGame"

interface BaseArgs {
    targetId: Id<"playersStatus">,
    userId: Id<"playersStatus">,
    version: number,
}

interface ProtectArgs extends BaseArgs {
    actionType: "protectKira" | "protectLawliet",
}
export const useProtect = () => {
    const action = useAction(api.actions.usePlayerAction)
    const {kiraStatusId,lawlietStatusId,gameId,round} = useReadStoreKandLids()

    return ({ targetId, userId, version, actionType }: ProtectArgs) => {
        action(
            {
                gameId,
                kiraStatusId,
                lawlietStatusId,
                round,
                version,
                targetId,
                userId,
                actionType,
            }
        )
    }
}

export const useKill = () => {
    const action = useAction(api.actions.usePlayerAction)
    const {kiraStatusId,lawlietStatusId,gameId,round} = useReadStoreKandLids()

    return ({ targetId, userId, version }: BaseArgs) => {
        action(
            {
                gameId,
                kiraStatusId,
                lawlietStatusId,
                round,
                version,
                targetId,
                userId,
                actionType: "kill",
            }
        )
    }
}

export const useJail = () => {
    const action = useAction(api.actions.usePlayerAction)
    const {kiraStatusId,lawlietStatusId,gameId,round} = useReadStoreKandLids()

    return ({ targetId, userId, version }: BaseArgs) => {
        action(
            {
                gameId,
                kiraStatusId,
                lawlietStatusId,
                round,
                version,
                targetId,
                userId,
                actionType: "jail",
            }
        )
    }
}

export const useInvestigate = () => {
    const action = useAction(api.actions.usePlayerAction)
    const {kiraStatusId,lawlietStatusId,gameId,round} = useReadStoreKandLids()

    return ({ targetId, userId, version }: BaseArgs) => {
        action(
            {
                gameId,
                kiraStatusId,
                lawlietStatusId,
                round,
                version,
                targetId,
                userId,
                actionType: "investigate",
            }
        )
    }
}

interface PlayerActionProps {
    displayFeedback: (message: string, errorCode?: number) => void,
    sucessMessage: string,
    failMessage: string
}
export const usePlayerAction = (props?: PlayerActionProps) => {
    const action = useAction(api.actions.usePlayerAction)
    const {kiraStatusId,lawlietStatusId,gameId,round} = useReadStoreKandLids()

    const displayFeedbackMessage = (executed: boolean) => {
        if (props) {
            const { displayFeedback, sucessMessage, failMessage } = props
            displayFeedback(
                executed ? sucessMessage : failMessage,
                executed ? undefined : 400
            )
        }
    }

    const protect = ({ targetId, userId, version, actionType }: ProtectArgs) => {
        action(
            {
                gameId,
                kiraStatusId,
                lawlietStatusId,
                round,
                version,
                targetId,
                userId,
                actionType,
            }
        ).then((res) => displayFeedbackMessage(res.executed))
    }

    const investigate = ({ targetId, userId, version }: BaseArgs) => {
        action(
            {
                gameId,
                kiraStatusId,
                lawlietStatusId,
                round,
                version,
                targetId,
                userId,
                actionType: "investigate",
            }
        ).then((res) => displayFeedbackMessage(res.executed))

    }

    const kill = ({ targetId, userId, version }: BaseArgs) => {
        action(
            {
                gameId,
                kiraStatusId,
                lawlietStatusId,
                round,
                version,
                targetId,
                userId,
                actionType: "kill",
            }
        ).then((res) => displayFeedbackMessage(res.executed))
    }

    const jail = ({ targetId, userId, version }: BaseArgs) => {
        action(
            {
                gameId,
                kiraStatusId,
                lawlietStatusId,
                round,
                version,
                targetId,
                userId,
                actionType: "jail",
            }
        ).then((res) => displayFeedbackMessage(res.executed))
    }

    return {
        protect,
        kill,
        jail,
        investigate
    }
}