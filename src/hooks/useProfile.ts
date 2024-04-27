import { useAppDispatch, useAppSelector } from "@/stores/hooks";
import { loadProfile } from "@/stores/profile/profile-slice";
import { selectProfile } from "@/stores/profile/selectors";
import {  useQuery } from "convex/react";
import { useEffect } from "react";
import { api } from "@convex/_generated/api";
import { selectPlayerVoteStatus } from "@/stores/game/selectors";

export const useLoadProfile = () => {

    const profile = useQuery(api.player.loadPlayerProfile)
    const dispatch = useAppDispatch()


    useEffect(() => {
        if ( profile) {
            dispatch(loadProfile(profile))
        }
    }, [dispatch,  profile])

    return profile
}

export const useReadStoreProfile = () => {
    const profile = useAppSelector(selectProfile)
    return profile
}
export const useReadStorePlayerId = () => {
    const profile = useAppSelector(selectProfile)
    return profile.tokenIdentifier
}

export const useReadStorePlayerVoteStatus = () => {
    const status = useAppSelector(selectPlayerVoteStatus)
    return status
}
