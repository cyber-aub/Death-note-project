import { useReadStoreChat } from "@/hooks/useChat";
import ChatInjector from "@/lib/stateLoaders/ChatLoader";
import StateLoader from "@/lib/stateLoaders/StateLoader";
import { Avatar, Card, List } from "antd";


export default function ChatMessages({round,gameId}:{round: number,gameId:string}) {
    const data = useReadStoreChat(round)

    return (
        <>
        {gameId !== "" ? <StateLoader injector={<ChatInjector round={round} gameId={gameId}/>} />: null }
        <List
            style={{height:"50vh",overflowY:"scroll"}}
            itemLayout="horizontal"
            dataSource={data}
            split={false}
            renderItem={(item) => {
                return (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<Avatar size="large" src={item.avatar} />}
                            title={item.author}
                            description={<Card type="inner">{item.message}</Card>}
                        />
                    </List.Item>
                )
            }}
        />
        </>
    )
}