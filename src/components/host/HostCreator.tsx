import { Space, Card, Descriptions, Button, Form, Input, Select, } from "antd";
import useTranslation from 'next-translate/useTranslation'
import type { DescriptionsProps } from "antd"
import { useNavigation } from "@/hooks/useNavigate";
import { useHostGame } from "@/lib/sdk";
import { useReadStoreProfile } from "@/hooks/useProfile";

const { Option } = Select;

const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
};

const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
};

export default function HostCreator() {
    const { t } = useTranslation("common")
    const profile = useReadStoreProfile()
    const navigation = useNavigation()
    const hostGame = useHostGame()

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: t('host_master'),
            children: <p>{profile.name ?? "nothing"}</p>,
        },
    ]

    const [form] = Form.useForm();

    const onFinish = (
        values: {
            hostPassword: string,
            maxPlayerCount: string,
            roundTimerInSeconds: string
        }) => {

        hostGame.execute(
            {
                password: values.hostPassword,
                maxPlayers: parseInt(values.maxPlayerCount),
                roundTimerInSeconds: parseInt(values.roundTimerInSeconds),
                hostId: profile.tokenIdentifier
            }
        ).then((lobbyId) => {
            navigation.navigateLobby(lobbyId)
        })

    };

    const onCancel = () => {
        navigation.navigateMainMenu()
    };


    return (
        <Card title={t('host_settings')} style={{ width: 600 }}>
            <Space direction="vertical">
                <Descriptions items={items} />

                <Form
                    {...layout}
                    layout="vertical"
                    form={form}
                    name="control-hooks"
                    onFinish={onFinish}
                >
                    <Form.Item name="hostPassword" label={t('password')} rules={[{ required: true }]}>
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="maxPlayerCount" label={t('max_players')} rules={[{ required: true }]}>
                        <Select
                            placeholder="Max players count"
                            allowClear
                        >
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                            <Option value="4">4</Option>
                            <Option value="5">5</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="roundTimerInSeconds" label={t('round_timer')} rules={[{ required: true }]}>
                        <Input />
                    </Form.Item>

                    <Form.Item {...tailLayout}>
                        <Space>
                            <Button htmlType="button" onClick={onCancel}>
                                {t('cancel')}
                            </Button>

                            <Button type="primary" htmlType="submit">
                                {t('create_game')}
                            </Button>
                        </Space>
                    </Form.Item>
                </Form>
            </Space>
        </Card>
    )
}