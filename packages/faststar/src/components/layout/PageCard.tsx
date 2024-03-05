import { Card } from "@arco-design/web-react"
import React, { PropsWithChildren } from "react"

export const PageCard: React.FC<PropsWithChildren> = (props) => {
    return (
        <div style={{ padding: "16px 20px 0" }}>
            <Card bordered={false} style={{ borderRadius: "4px", paddingTop: 10 }}>
                {props.children}
            </Card>
        </div>
    )
}
