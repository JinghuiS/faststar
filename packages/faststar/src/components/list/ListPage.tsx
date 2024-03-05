import React from "react"
import { Card, PageHeader } from "@arco-design/web-react"
import { ListTable, type ListTableProps } from "./ListTable"
import { PageCard } from "../layout/PageCard"

export const ListPage = (props: ListTableProps) => {
    const { title, ..._props } = props
    return (
        <>
            {/* {title && (
                <PageHeader style={{ background: "var(--color-bg-2)" }} title={title}></PageHeader>
            )} */}
            <PageCard>
                <ListTable {...props} />
            </PageCard>
        </>
    )
}
