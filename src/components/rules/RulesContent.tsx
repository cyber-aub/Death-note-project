import { Card, Space, Typography } from "antd"


export default function RulesContent (props:{rules:Array<Array<{ rule: string, id: number }>>}){
    const rules = props.rules[0]
    return (
        <Card >
            <Space  direction="vertical">
                    {
                        rules.map((rule) => {
                            return (
                                <Typography.Text key={`Rule${rule.id}`} className="text-3xl">
                                    {rule.rule}
                                </Typography.Text>
                            )
                        })
                    }
                </Space>
        </Card>
    )
}