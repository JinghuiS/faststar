import { Button, Form, Message, Space, type FormInstance, Grid } from "@arco-design/web-react"
import { get, isEmpty, isNumber } from "lodash-es"
import React, { useEffect, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { type BasicRecord, useRefreshList } from "../../api"
import { useCreate } from "../../api/useCreate"
import { useUpdate } from "../../api/useUpdate"
import { useResourceContext } from "../../context/resource"
import { ViewTypeContextProvider } from "../../context/viewtype"
import { useSendRequest } from "../../hooks/useSendRequest"
import type { FieldHandler } from "../fields/factory"
import { SubmitButton } from "../SubmitButton"
import { useFaststarContext } from "../../context/faststar"

export interface EditFormProps {
    fields: FieldHandler[]
    record: BasicRecord | null // edit or create
    // onSuccess?: (values: BasicRecord) => void
    // onCancel?: () => void
    rowKey?: string
    form: FormInstance
    gutter?: number
}

const FormBody = (props: { children: React.ReactNode; gutter?: number }) => {
    if (props.gutter) {
        return <Grid.Row gutter={props.gutter}>{props.children}</Grid.Row>
    }
    return props.children
}

const FormColItem = (props: { children: React.ReactNode; span?: number }) => {
    if (props.span) {
        return <Grid.Col span={props.span}>{props.children}</Grid.Col>
    } else {
        return props.children
    }
}

export const EditForm: React.FC<EditFormProps> = React.memo((props) => {
    const isCreate = props.record === null
    const form = props.form

    const resource = useResourceContext()
    const faststarContext = useFaststarContext()
    const rowKey = props.rowKey || faststarContext.rowKey || "id"
    const items = useMemo(() => {
        return props.fields
            .map((handler) => (isCreate ? handler("create") : handler("edit")))
            .filter((item) => !item.hidden)
    }, [props.fields, isCreate])

    useEffect(() => {
        if (props.record) {
            form.setFieldsValue(props.record)
        }
    }, [props.record, items])

    return (
        <ViewTypeContextProvider viewType={isCreate ? "create" : "edit"}>
            <Form
                form={form}
                layout="vertical"
                validateTrigger={["onBlur", "onFocus"]}
                // initialValues={defaultValues}
            >
                <FormBody gutter={props.gutter}>
                    {items.map((item, i) => {
                        if (item.source === rowKey) {
                            // Dont render id field
                            return null
                        }
                        let span = item.span
                        // console.log(span, isEmpty(item.span))

                        if (isNumber(props.gutter) && !isNumber(item.span)) {
                            span = 24
                        }
                        if (!isNumber(props.gutter)) {
                            span = undefined
                        }

                        return (
                            <FormColItem key={`${item.source}#${i}`} span={span}>
                                <Form.Item
                                    label={item.title}
                                    field={item.source}
                                    rules={item.rules}
                                >
                                    {(formData, form) =>
                                        item.render(get(formData, item.source), (val) => {
                                            form.setFieldValue(item.source, val)
                                        })
                                    }
                                </Form.Item>
                            </FormColItem>
                        )
                    })}
                </FormBody>
            </Form>
        </ViewTypeContextProvider>
    )
})
EditForm.displayName = "EditForm"
