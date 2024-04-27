import { Doc } from "../_generated/dataModel";



export type ReadLobbyResponse = {
    lobby:Doc<"lobbies"> | null,
    players:Doc<"playersStatus">[] | null,
  }