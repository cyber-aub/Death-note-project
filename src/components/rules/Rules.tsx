import {Layout } from "antd"
import useTranslation from 'next-translate/useTranslation'
import { useState } from "react"
import RulesContent from "./RulesContent"
import RulesDrawer from "./RulesDrawer"


export default function Rules() {
    const { t } = useTranslation("rules")



    const [selectedKey, setSelectedKey] = useState<string>("generalRulesArray")
    const rules = Array<Array<{ rule: string, id: number }>>(t(selectedKey,{}, { returnObjects: true }))
    return (
        <div className="w-full h-full flex flex-row">
                <RulesDrawer selectedKey={selectedKey} onClick={setSelectedKey} />
            <div className="flex flex-col justify-center p-4">
                <RulesContent rules={rules}/>
            </div>
        </div>
    )
}