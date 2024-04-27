import { Space, Card, Button, Form, Input, } from "antd";
import useTranslation from 'next-translate/useTranslation'
import { useFeedbackModal, useNavigation } from "@/hooks/useNavigate";
import { useJoinGame } from "@/lib/sdk";


const layout = {
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export default function JoinGame() {
    const { t } = useTranslation("common")
    const navigation = useNavigation()
    const joinGame = useJoinGame()

    const [form] = Form.useForm();
    const {contextHolder,display:displayFeedback} = useFeedbackModal()
 

    const onFinish = (
        values: {
            password: string,
            lobbyId: string,
        }) => {
            const onFail = (errorCode:number) => {
                displayFeedback(t("connect_failed"),errorCode)
            }
            joinGame.execute({...values,onFail})
    };

    const onCancel = () => {
        navigation.navigateMainMenu()
    };


    return (
        <Card title={t('join_game')} style={{ width: 600 }}>

                <Form
                    {...layout}
                    layout="horizontal"
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                >

                    <Form.Item name="lobbyId" label={t('game_id')} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item name="password" label={t('password')} rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>


                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button htmlType="button" onClick={onCancel}>
                                Cancel
                            </Button>

                            <Button type="primary" htmlType="submit">
                                Connect
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
                {contextHolder}
        </Card>
    )
}