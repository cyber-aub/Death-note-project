import { Id } from "../_generated/dataModel";


export interface StartGameResponse {
    status: number,
    message: string,
    gameId: Id<"games"> | null,
}