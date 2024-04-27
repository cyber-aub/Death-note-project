import { useReadStoreGame } from "@/hooks/useGame";
import { Typography,Card } from "antd";
import useTranslation from 'next-translate/useTranslation'
import { useEffect, useMemo } from "react";
import { useTimer } from "react-timer-hook";


interface RoundTimerProps{
    round: number;
    roundStartTimestamp: number;
    roundDurationInSeconds: number;
}
export default function RoundTimer(){
    const {t} = useTranslation("common");
    const {roundStartTimestamp,round,roundTimerInSeconds:roundDurationInSeconds} = useReadStoreGame();

    const expiryTimestamp = useMemo(() => new Date(roundStartTimestamp+roundDurationInSeconds*1000),
    [roundStartTimestamp,roundDurationInSeconds]);

    const {seconds, minutes,restart} = useTimer({expiryTimestamp,autoStart:true});


    useEffect(()=>{
        restart(expiryTimestamp)
    },[restart,expiryTimestamp])

    return (
        <Card className="flex flex-row items-center justify-center w-full h-full" bodyStyle={{padding:"0"}}>
        <Typography.Title level={4} className="m-0">
            {t("round") } {round} : {minutes}:{seconds}
        </Typography.Title>
        </Card>
    )
}