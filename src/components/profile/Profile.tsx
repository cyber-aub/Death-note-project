import { useFeedbackModal, useNavigation } from "@/hooks/useNavigate";
import { useStoreUser } from "@/lib/sdk";
import { Alert, Button, Card, Form, FormInstance, Input,  Modal, Space } from "antd";
import useTranslation from 'next-translate/useTranslation'
import { useReadStoreProfile } from "@/hooks/useProfile";
import { Profile } from "@/domain/profile";

const labelCol = { span: 20 }

const numberOfScrects = [1, 2, 3, 4, 5]

const layout = {
    labelCol: { span: 8 },
};

export default function Profile() {
    const navigation = useNavigation()
    const createUser = useStoreUser()
    const { t } = useTranslation("common")
    const [secretsForm] = Form.useForm();
    const [profileForm] = Form.useForm();

    const profileStore = useReadStoreProfile()
    const { contextHolder, display: displayFeedback } = useFeedbackModal()





    const onSave = () => {

        Promise.all([
            secretsForm.validateFields(),
            profileForm.validateFields()
        ]).then((values) => {
            const profile = {
                ...values[0],
                ...values[1]
            }
            createUser(profile).then(() => {
                displayFeedback(t('profile_saved'))
            })


        }).catch((err) => { })

    }


    const onCancel = () => {
        navigation.navigateMainMenu()
    };


    const profileProps = {
        displayNameLabel: t('display_name'),
        profileLabel: t('profile'),
        profilePictureLabel: t('profile_picture'),
        backgroundLabel: t('background'),
        form: profileForm,
        handleFinish: () => { },
        profile: profileStore

    }

    const secretsProps = {
        secretsLabel: t('secrets'),
        secretLabel: t('secret'),
        form: secretsForm,
        handleFinish: () => { },
        profile: profileStore
    }

    return (
        <div className="w-full h-full flex flex-row">
            <Card className="h-full w-40 flex flex-col items-center justify-center">
                <Space className="h-full w-full" direction="vertical">
                    <Button className="w-full" type="primary" onClick={onSave}>
                        {t("save")}
                    </Button>

                    <Button className="w-full" htmlType="button" onClick={onCancel}>
                        {t("mainMenu")}
                    </Button>

                </Space>
            </Card>
            <div className="flex flex-row justify-evenly w-full items-center p-4">

                <ProfileCard {...profileProps} />
                <SecretsCard {...secretsProps} />


            </div>
            {contextHolder}

        </div>
    )
}

interface ProfileCardProps {
    displayNameLabel: string,
    backgroundLabel: string,
    profileLabel: string,
    profilePictureLabel: string,
    handleFinish: (values: any) => void,
    form: FormInstance<any>,
    profile: Profile

}
function ProfileCard(props: ProfileCardProps) {
    const { displayNameLabel, profileLabel, backgroundLabel, profilePictureLabel } = props
    const { form, handleFinish, profile } = props

    return (
        <Card title={profileLabel} style={{ width: 400, height: "100%" }} suppressHydrationWarning>
            <Form
                {...layout}
                layout="vertical"
                name="profile-form"
                form={form}
                onFinish={handleFinish}
            >

                <Form.Item name="name" label={displayNameLabel} initialValue={profile.name} labelCol={labelCol} rules={[{ required: true }]} >
                    <Input style={{ fontSize: 24 }} />
                </Form.Item>


                <Form.Item name="profilePicture" label={profilePictureLabel} initialValue={profile.profilePicture} labelCol={labelCol} rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item name="background" label={backgroundLabel} labelCol={labelCol} initialValue={profile.background} rules={[{ required: true }]}>
                    <Input.TextArea autoSize={{ minRows: 8, maxRows: 8 }} />
                </Form.Item>


            </Form>
        </Card>
    )
}


interface SecretsCardProps {
    secretsLabel: string,
    secretLabel: string,
    handleFinish: (values: any) => void,
    form: FormInstance<any>,
    profile: any

}
function SecretsCard(props: SecretsCardProps) {
    const { secretsLabel, secretLabel } = props
    const { form, handleFinish, profile } = props

    return (
        <Card title={secretsLabel} style={{ width: 400, height: "100%" }} suppressHydrationWarning>
            <Form
                {...layout}
                layout="vertical"
                name="secrets-form"
                form={form}
                onFinish={handleFinish}
            >

                {
                    numberOfScrects.map((_, index) => {
                        const key = `secret${index + 1}`
                        return (
                            <Form.Item className="w-full" key={key} name={key} initialValue={profile[key]} label={secretLabel} rules={[{ required: true }]}>
                                <Input className="w-full" />
                            </Form.Item>
                        )
                    })
                }

            </Form>
        </Card>
    )
}

interface SaveStatusModalProps {
    isModalOpen: boolean,
    handleOk: () => void,
    handleCancel: () => void,
    successMessage: string,
}
function SaveStatusModal({ isModalOpen, handleOk, successMessage }: SaveStatusModalProps) {


    return (
        <Modal open={isModalOpen} >

            <Alert message={successMessage} type="success" />

        </Modal>
    )
}