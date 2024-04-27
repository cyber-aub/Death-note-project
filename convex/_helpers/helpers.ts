
interface PlayerJoinedOptions {
    playerId: string,
    playerIds: string[],
}
export const playerAlreadyJoined = ({ playerId, playerIds }: PlayerJoinedOptions) => {
    return playerIds.includes(playerId)
}

export const randomIndex = (length: number) => {
    return Math.floor(Math.random() * (length));
}

interface Vote {
    voteImpact: number, voteType: string, targetId: string, playerId: string
}
export const alreadyVoted = (playerId: string, roundVotes: Vote[]) => {
    let voted = false
    roundVotes.forEach((vote) => {
        if (vote.playerId === playerId) {
            voted = true
        }
    })
    return voted
}
interface GameOverOptions {
    round: number,
    roundVotes: Vote[],
    playerIds: string[],
    roundTimerInSeconds: number,
    roundStartTimestamp: number,

}
export const IsFinalRound = (game:GameOverOptions) => {
    return game.round > 10
}

export const IsVotingOver = (game:GameOverOptions) => {
    return game.roundVotes.length === game.playerIds.length
}
