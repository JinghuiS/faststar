import React from "react"
import type { FieldHandler } from "../fields"
import { useEditController } from "./useEditController"
import { EditForm } from "./EditForm"
import { Button, Card, PageHeader, Space, Spin } from "@arco-design/web-react"
import { SubmitButton } from "../SubmitButton"
import { useTranslation } from "react-i18next"
import { useNavigate, useParams } from "react-router-dom"
import { useResourceContext } from "../../context/resource"
import { useCreatePath } from "../../hooks/useCreatePath"
import styled from "styled-components"
import { connectRequestDataStore } from "../../context/request-data-store"
import { Helmet } from "react-helmet-async"

export interface EditPageProps {
    fields?: FieldHandler[]
    gutter?: number
    isCreate?: boolean
}

const ActionBox = styled.div`
    padding: 12px 40px;
    background-color: var(--color-bg-2);
    display: flex;
    flex-direction: row-reverse;
    position: fixed;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow: 0 -3px 12px rgb(0 0 0 / 10%);
`

export const EditPage = connectRequestDataStore((props: EditPageProps) => {
    const { fields, gutter, isCreate: propsIsCreate } = props
    const { t } = useTranslation()
    const resource = useResourceContext()
    const { id: routeId } = useParams<"id">()
    const isCreate = routeId ? false : propsIsCreate
    // console.log(isCreate, propsIsCreate)

    const title = isCreate ? t("faststar.edit.create") : t("faststar.edit.edit")

    const navigate = useNavigate()
    const createPath = useCreatePath()

    const back = () => {
        if (window.history.length > 1) {
            return navigate(-1)
        }
        navigate(createPath({ resource, type: "list" }))
    }

    const { handleSubmit, form, record, isLoading, createOpt, updateOneOpt } = useEditController({
        fields: fields || [],
        isCreate,
        // record: props.record,
        onSuccess: () => {
            back()
        }
    })

    return (
        <>
            <Helmet>
                <title>{title}</title>
            </Helmet>
            <Spin
                style={{ display: "block" }}
                loading={isLoading || createOpt.isPending || updateOneOpt.isPending}
            >
                <PageHeader
                    style={{ background: "var(--color-bg-2)" }}
                    title={title}
                    // subTitle="This is a description"
                    backIcon
                    onBack={back}
                >
                    <EditForm gutter={gutter} fields={fields || []} form={form} record={record} />
                </PageHeader>

                <ActionBox>
                    <Space>
                        <SubmitButton type="primary" onClick={handleSubmit}>
                            {isCreate ? t("faststar.edit.create") : t("faststar.edit.save")}
                        </SubmitButton>
                        {/* <Button type="default" onClick={onCancel}>
                    {t("faststar.edit.cancel")}
                </Button> */}
                    </Space>
                </ActionBox>
            </Spin>
        </>
    )
})

EditPage.displayName = "EditPage"
