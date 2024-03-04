import React from "react"
import { Drawer, Form, Message, Spin } from "@arco-design/web-react"

import { useTranslation } from "react-i18next"
import { useUpdate, type BasicRecord, useCreate, useRefreshList } from "../../../api"
import type { ViewType } from "../../../context/viewtype"
import { useEvent } from "../../../hooks/useEvent"
import { EditForm } from "../../edit"
import type { FieldHandler } from "../../fields"
import { DetailForm } from "../../detail"
import { useSendRequest } from "../../../hooks/useSendRequest"
import { create } from "zustand"
import { useFaststarContext } from "../../../context/faststar"
import { useResourceContext } from "../../../context/resource"
import { useEditController } from "../../edit/useEditController"

export interface ListTableDrawerProps {
    visible: boolean
    onChangeVisible: (visible: boolean) => void
    fields: FieldHandler[]
    record: BasicRecord | null
    viewType: ViewType
    width?: number
}
export const ListTableDrawer: React.FC<ListTableDrawerProps> = React.memo((props) => {
    const { t } = useTranslation()
    // const [form] = Form.useForm()
    const resource = useResourceContext()

    const hide = useEvent(() => {
        props.onChangeVisible(false)
        form.resetFields()
    })
    const isCreate = props.viewType === "create"
    const isDetail = props.viewType === "detail"

    const { handleSubmit, form, record, isLoading, createOpt, updateOneOpt } = useEditController({
        isCreate,
        fields: props.fields,
        record: props.record,
        onSuccess: hide

        // onCancel: hide,
    })

    let title = ""
    if (isCreate) {
        title = t("faststar.list.create")
    }
    if (props.viewType === "edit") {
        title = t("faststar.list.edit")
    }
    if (isDetail) {
        title = t("faststar.list.detail")
    }
    // const defaultValues = useMemo(() => {
    //     const v = props.record ?? ({} as BasicRecord)
    //     if (isCreate) {
    //         items.forEach((item) => {
    //             if (typeof v[item.source] === "undefined" && typeof item.default !== "undefined") {
    //                 v[item.source] = item.default
    //             }
    //         })
    //     }

    //     return v
    // }, [props.record, isCreate, items])

    return (
        <Drawer
            title={title}
            visible={props.visible}
            onCancel={hide}
            width={props.width ?? 680}
            mountOnEnter={true}
            unmountOnExit={true}
            maskClosable={props.viewType !== "edit"}
            onOk={handleSubmit}
            okText={isCreate ? t("faststar.edit.create") : t("faststar.edit.save")}
            {...(isDetail ? { footer: null } : {})}
            confirmLoading={isLoading || createOpt.isPending || updateOneOpt.isPending}
            // footer={isDetail && null }
        >
            <Spin
                style={{ display: "block" }}
                loading={isLoading || createOpt.isPending || updateOneOpt.isPending}
            >
                {props.viewType === "edit" || props.viewType === "create" ? (
                    <EditForm
                        form={form}
                        fields={props.fields}
                        record={record}
                        // onSuccess={hide}
                        // onCancel={hide}
                    />
                ) : (
                    <DetailForm fields={props.fields} record={props.record ?? ({} as any)} />
                )}
            </Spin>
        </Drawer>
    )
})
ListTableDrawer.displayName = "ListTableDrawer"
