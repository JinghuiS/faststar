import { Button, Dropdown, Menu, Space, Tooltip } from "@arco-design/web-react"
import { IconEdit, IconEye, IconMoreVertical } from "@arco-design/web-react/icon"
import { isFunction, isObject } from "lodash-es"
import React, { useEffect, useMemo } from "react"
import type { BasicRecord } from "../../api"
import type { ViewType } from "../../context/viewtype"
import { useTranslation } from "../../i18n"
// import { ListDeleteAction } from "./actions/DeleteAction"
import type { ListTableCustomAction, ListTableProps } from "./ListTable"
import { useRequestDataStoreApi } from "../../context/request-data-store"
import { ListDeleteAction } from "./actions/DeleteAction"
import { useNavigate } from "react-router-dom"
import { useCreatePath } from "../../hooks/useCreatePath"
import { useResourceContext } from "../../context/resource"
import { ListEditAction } from "./actions/EditAction"
import { ListDetailAction } from "./actions/DetailAction"
// import { useRecordContext } from "../../context/record"

export function useListTableColumns(
    props: ListTableProps,
    filterValues: Record<string, any>,
    showTableDrawer?: (viewType: ViewType, record: BasicRecord) => void
) {
    const { t } = useTranslation()
    const requestDataStore = useRequestDataStoreApi()
    const resourceContext = useResourceContext()
    const { action } = props

    const navigate = useNavigate()
    const createPath = useCreatePath()

    const columns = useMemo(() => {
        const c = [...props.fields]
            .map((fieldHandler) => fieldHandler("list"))
            .filter((item) => !item.hidden)
            .map((item) => item.columnProps)

        if (action) {
            c.push({
                key: "actions",
                title: t("faststar.list.actions"),
                fixed: "right",
                render: (val, record) => {
                    return (
                        <Space>
                            <ListDetailAction
                                options={action.detail}
                                record={record}
                                showTableDrawer={showTableDrawer}
                            />

                            <ListEditAction
                                options={action.edit}
                                record={record}
                                showTableDrawer={showTableDrawer}
                            />

                            {action.delete && <ListDeleteAction record={record} />}

                            {action.custom && (
                                <CustomActions actions={action.custom} record={record} />
                            )}
                        </Space>
                    )
                }
            })
        }

        return c
    }, [props.fields, action, t])

    return columns
}

const CustomActions: React.FC<{
    actions: ListTableCustomAction
    record: BasicRecord
}> = React.memo((props) => {
    const actions = useMemo(() => {
        return isFunction(props.actions) ? props.actions(props.record) : props.actions
    }, [props.actions, props.record])

    return (
        <Dropdown
            position="br"
            trigger="click"
            droplist={
                <Menu>
                    {actions.map((item) => (
                        <Menu.Item key={item.key} onClick={() => item.onClick(props.record)}>
                            {item.label}
                        </Menu.Item>
                    ))}
                </Menu>
            }
        >
            <Button icon={<IconMoreVertical />} />
        </Dropdown>
    )
})
CustomActions.displayName = "CustomActions"
