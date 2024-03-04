import { Form, Message } from "@arco-design/web-react"
import { useCreate, useUpdate, type BasicRecord, useRefreshList, useGetOne } from "../../api"
import { useFaststarContext } from "../../context/faststar"
import { useResourceContext } from "../../context/resource"
import type { FieldHandler } from "../fields"
import { useTranslation } from "react-i18next"
import { useSendRequest } from "../../hooks/useSendRequest"
import { useMemo } from "react"
import { useParams } from "react-router-dom"

interface FaststarFormProps {
    fields: FieldHandler[]
    record?: BasicRecord | null
    onSuccess?: (values: BasicRecord) => void
    onCancel?: () => void
    rowKey?: string
    isCreate?: boolean
}

export const useEditController = (props: FaststarFormProps) => {
    const { isCreate: propsIsCreate } = props

    const [form] = Form.useForm()
    const [create, createOpt] = useCreate()
    const [updateOne, updateOneOpt] = useUpdate()
    const resource = useResourceContext()
    const faststarContext = useFaststarContext()
    const { t } = useTranslation()
    const refresh = useRefreshList(resource)
    const { id: routeId } = useParams<"id">()

    const isCreate = routeId ? false : propsIsCreate

    const items = useMemo(() => {
        return props.fields
            .map((handler) => (isCreate ? handler("create") : handler("edit")))
            .filter((item) => !item.hidden)
    }, [props.fields, isCreate])
    const defaultValues = useMemo(() => {
        const v = props.record ?? ({} as BasicRecord)
        if (isCreate) {
            items.forEach((item) => {
                if (typeof v[item.source] === "undefined" && typeof item.default !== "undefined") {
                    v[item.source] = item.default
                }
            })
        }

        return v
    }, [props.record, isCreate, items])

    const rowKey = props.rowKey || faststarContext.rowKey || "id"
    const id = routeId ? decodeURIComponent(routeId) : defaultValues[rowKey]

    const {
        data: record,
        error,
        isLoading,
        isFetching,
        refetch
    } = useGetOne(
        resource,
        { id },
        {
            refetchOnReconnect: false,
            refetchOnWindowFocus: false,
            retry: false,
            enabled: !!id
            // refetchOnMount: false
            // onError: () => {
            //     notify("ra.notification.item_doesnt_exist", {
            //         type: "error"
            //     })
            //     redirect("list", resource)
            //     refresh()
            // },

            // ...otherQueryOptions
        }
    )

    const handleSubmit = useSendRequest(async () => {
        try {
            const values = form.getFieldsValue()

            await form.validate()

            if (isCreate) {
                await create(resource, {
                    data: { ...values }
                })
                refresh() // refresh list after call create in list drawer
            } else {
                if (!id) {
                    Message.error("Cannot update record, not found id")
                    return
                }
                await updateOne(resource, {
                    id: id,
                    data: { ...values }
                })
            }

            props.onSuccess?.(values as BasicRecord)
            Message.success(t("faststar.common.operateSuccess") ?? "")
        } catch (err) {
            Message.error(t("faststar.common.operateFailed") + ":" + String(err))
        }
    })

    return {
        handleSubmit,
        form,
        record,
        isLoading,
        refetch,
        createOpt,
        updateOneOpt
    }
}
