import { Button, Form, Grid, Space, Tooltip } from "@arco-design/web-react"
import React, { useEffect, useState } from "react"
import { useControlledObjectState } from "../../../hooks/useObjectState"
import type { FieldHandler } from "../../fields"
import { get } from "lodash-es"
import { IconCaretDown, IconCaretUp, IconRefresh, IconSearch } from "@arco-design/web-react/icon"
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

const SearchFormWrapper = styled.div<{ $collapsed: boolean }>`
    display: flex;
    width: 100%;
    border-bottom: 1px dashed var(--color-border-2);

    transition: all 0.3s;
    ${(props) => (props.$collapsed ? "height: 52px;overflow: hidden;" : "")}
`

const SearchForm = styled(Form)`
    padding-right: 20px;

    .arco-form-label-item-left {
        > label {
            white-space: nowrap;
        }
    }
`

const SearchFormCollapsedIcon = styled.div`
    position: absolute;
    left: 50%;
    bottom: -13px;
    transform: translateX(-50%);
    cursor: pointer;
`

const RightButton = styled.div`
    /* height: 100%; */
    /* display: flex; */
    /* flex-direction: column; */
    /* justify-content: space-between; */
    /* align-items: center; */
    flex: 1;
    text-align: center;
    padding-left: 20px;
    border-left: 1px dashed var(--color-border-2);
    box-sizing: border-box;
    margin-bottom: 20px;
`

export const ListFilter: React.FC<ListFilterProps> = React.memo((props) => {
    const [form] = useForm()
    const [collapsed, setCollapsed] = useState(true)
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
        <div style={{ position: "relative" }}>
            <SearchFormWrapper $collapsed={collapsed}>
                <SearchForm
                    // style={{ flex: 1 }}
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
                                                    form.setFieldValue(
                                                        c.source,
                                                        castFilterValue(val)
                                                    )
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
                    <Button
                        icon={<IconRefresh />}
                        style={{
                            marginTop: 20
                        }}
                        onClick={handleReset}
                    >
                        {t("faststar.list.searchForm.reset")}
                    </Button>
                </RightButton>
            </SearchFormWrapper>
            <SearchFormCollapsedIcon>
                <Tooltip
                    trigger={["click", "hover"]}
                    // popupHoverStay={false}
                    content={
                        collapsed
                            ? t("faststar.list.searchForm.expand")
                            : t("faststar.list.searchForm.collapse")
                    }
                >
                    {!collapsed ? (
                        <IconCaretUp
                            onClick={() => {
                                setCollapsed(!collapsed)
                            }}
                            style={{
                                fontSize: 20,
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                            }}
                        />
                    ) : (
                        <IconCaretDown
                            onClick={() => {
                                setCollapsed(!collapsed)
                            }}
                            style={{
                                fontSize: 20,
                                strokeLinecap: "round",
                                strokeLinejoin: "round"
                            }}
                        />
                    )}
                </Tooltip>
            </SearchFormCollapsedIcon>
        </div>
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
