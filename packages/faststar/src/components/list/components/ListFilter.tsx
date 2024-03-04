import { Button, Form, Grid, Space } from "@arco-design/web-react"
import React, { useEffect } from "react"
import { useControlledObjectState } from "../../../hooks/useObjectState"
import type { FieldHandler } from "../../fields"
import { get } from "lodash-es"
import { IconRefresh, IconSearch } from "@arco-design/web-react/icon"
import { useTranslation } from "react-i18next"
import { styled } from "styled-components"
import { useRequestDataStoreDataQuery } from "../../../context/request-data-store"

const { useForm } = Form

interface ListFilterProps {
    fields: FieldHandler[]
    filterValues: Record<string, any>
    onChangeFilter: (values: Record<string, any>) => void
    resource: string
    // rightButtonDirection?: "horizontal" | "vertical"
}

const SearchFormWrapper = styled.div`
    display: flex;
    width: 100%;
    border-bottom: 1px solid var(--color-border-1);
`

const SearchForm = styled(Form)`
    padding-right: 20px;

    .arco-form-label-item-left {
        > label {
            white-space: nowrap;
        }
    }
`

const RightButton = styled.div`
    /* height: 100%; */
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding-left: 20px;
    border-left: 1px solid var(--color-border-2);
    box-sizing: border-box;
    margin-bottom: 20px;
`

export const ListFilter: React.FC<ListFilterProps> = React.memo((props) => {
    useRequestDataStoreDataQuery(props.fields, props.filterValues, props.resource)
    const [form] = useForm()
    // const [filterValues, setFilterValues] = useControlledObjectState<Record<string, any>>(
    //     props.filterValues,
    //     props.onChangeFilter
    // )

    useEffect(() => {
        form.setFieldsValue(props.filterValues)
    }, [])

    const { t } = useTranslation()
    const colSpan = 12

    const handleSubmit = () => {
        const values = form.getFieldsValue()
        props.onChangeFilter(values)
    }

    const handleReset = () => {
        form.resetFields()
        props.onChangeFilter({})
    }

    // const rightButtonDirection = props.rightButtonDirection ?? "vertical"

    return (
        <SearchFormWrapper>
            <SearchForm
                form={form}
                labelAlign="left"
                labelCol={{ span: 5 }}
                wrapperCol={{ span: 19 }}
            >
                <Grid cols={3} colGap={24}>
                    {props.fields.map((fieldHandler, i) => {
                        const c = fieldHandler("edit")

                        return (
                            <Grid.GridItem key={i}>
                                <Form.Item label={c.title} field={c.source}>
                                    {(formData, form) =>
                                        c.render(
                                            get(formData, c.source),
                                            (val) => {
                                                // console.log(val, c.source)
                                                form.setFieldValue(c.source, castFilterValue(val))
                                            }
                                            // setFilterValues({ [c.source]: castFilterValue(val) })
                                        )
                                    }
                                </Form.Item>
                            </Grid.GridItem>
                        )
                    })}
                </Grid>
            </SearchForm>
            <RightButton>
                <Button type="primary" icon={<IconSearch />} onClick={handleSubmit}>
                    {t("faststar.list.searchForm.search")}
                </Button>
                <Button icon={<IconRefresh />} onClick={handleReset}>
                    {t("faststar.list.searchForm.reset")}
                </Button>
            </RightButton>
        </SearchFormWrapper>
    )
})
ListFilter.displayName = "ListFilter"

function castFilterValue(input: any) {
    if (
        input === "" ||
        input === null ||
        input === undefined ||
        (Array.isArray(input) && input.length === 0)
    ) {
        return undefined
    }

    return input
}
