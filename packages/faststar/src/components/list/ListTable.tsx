import React, { useState } from "react"
import {
    Button,
    Card,
    Divider,
    Space,
    Table,
    Typography,
    type TableProps
} from "@arco-design/web-react"
import { useResourceContext } from "../../context/resource"
import {
    type BasicRecord,
    type FilterPayload,
    type GetListParams,
    type Identifier,
    type SortPayload,
    useGetList
} from "../../api"
import type { FieldHandler } from "../fields"
import styled from "styled-components"

import { useDebounce } from "../../hooks/useDebounce"

import { ViewTypeContextProvider } from "../../context/viewtype"
import {
    BatchSelectedIdsContextProvider,
    ListParamsContextProvider,
    ListTableContextProvider
} from "./context"
// import { ListExportAction } from "./actions/ExportAction"
import { useTranslation } from "react-i18next"
// import { useListTableDrawer } from "./useListTableDrawer"
import { useListTableColumns } from "./useColumns"
// import { ListRefreshAction } from "./actions/RefreshAction"
// import { ListBatchDeleteAction } from "./actions/BatchDeleteAction"
import { useUrlState } from "../../hooks/useUrlState"
import type { ComponentsProps } from "@arco-design/web-react/es/Table/interface"
import { ListFilter } from "./components/ListFilter"
import {
    RequestDataStoreProvider,
    connectRequestDataStore,
    useRequestDataStoreDataQuery
} from "../../context/request-data-store"
import { useFaststarContext } from "../../context/faststar"
import { ListTableRow } from "./components/ListTableRow"
import { useListTableDrawer } from "./useListTableData"
import { useNavigate } from "react-router-dom"
import { useCreatePath } from "../../hooks/useCreatePath"
import type { ListEditActionProps } from "./actions/EditAction"
import type { ListDetailActionProps } from "./actions/DetailAction"
import { ListCreateAction, type ListCreateActionProps } from "./actions/CreateAction"

const Header = styled.div`
    width: 100%;
    /* display: flex;
    justify-content: space-between; */
    /* margin-bottom: 8px; */
    /* margin-top: 20px; */

    .actions {
        margin-top: 20px;
    }
`

const tableComponents: ComponentsProps = {
    body: {
        row: ListTableRow
    }
}

export interface ListTableCustomActionItem {
    key: string
    label: string
    onClick: (record: BasicRecord) => void
}

export type ListTableActionItemType = "drawer" | "page"
export type ListTableCustomAction =
    | ListTableCustomActionItem[]
    | ((record: BasicRecord) => ListTableCustomActionItem[])

export interface ListTableProps {
    className?: string
    filter?: FieldHandler[]
    fields: FieldHandler[]
    defaultSort?: SortPayload
    defaultFilter?: FilterPayload
    showTotal?: boolean
    showSizeChanger?: boolean
    title?: string
    rowKey?: string

    // showSearch?: boolean
    /**
     * Allow pass table props into table element
     */
    tableProps?: Omit<
        TableProps,
        | "loading"
        | "columns"
        | "data"
        | "rowKey"
        | "rowSelection"
        | "components"
        | "pagination"
        | "onChange"
    >
    action?: {
        create?: ListCreateActionProps["options"]
        detail?: ListDetailActionProps["options"]
        edit?: ListEditActionProps["options"]
        delete?: boolean
        export?: boolean
        refresh?: boolean
        custom?: ListTableCustomAction
    }
    batchAction?: {
        delete?: boolean
    }
}

const _ListTable = React.memo((props: ListTableProps) => {
    const resource = useResourceContext()
    const faststarContext = useFaststarContext()
    const defaultFilter = props.defaultFilter ?? {}
    const [filterValues, setFilterValues] = useUrlState(defaultFilter, {
        nestedKey: "filter"
    })
    const [sort, setSort] = useState<SortPayload | undefined>(props.defaultSort)
    const lazyFilter = useDebounce(filterValues, { wait: 500 })
    const { t } = useTranslation()
    const [pageNum, setPageNum] = useState(1)
    const [pageSize, setPageSize] = useState(20)
    const listParams: Partial<GetListParams> = {
        pagination: {
            page: pageNum,
            perPage: pageSize
        },
        filter: lazyFilter,
        sort
    }
    const { data: list, isLoading, total, refetch } = useGetList(resource, listParams)
    const action = props.action
    const batchAction = props.batchAction
    const { showTableDrawer, drawerEl } = useListTableDrawer(props.fields)
    const filterFields = props.filter ?? []
    const [selectedRowKeys, setSelectedRowKeys] = useState<Identifier[]>([])

    const columns = useListTableColumns(props, lazyFilter, showTableDrawer)

    const hasHeader = filterFields.length > 0 || action?.export === true || action?.create === true

    const rowSelection: TableProps["rowSelection"] = batchAction
        ? {
              type: "checkbox",
              selectedRowKeys,
              onChange: (selectedRowKeys) => {
                  setSelectedRowKeys(selectedRowKeys)
              }
          }
        : undefined

    const showBatchAction =
        batchAction && Array.isArray(selectedRowKeys) && selectedRowKeys.length > 0
    const title = props.title
    const rowKey = props.rowKey ?? faststarContext.rowKey

    const headerEl = (
        <Header>
            {title && (
                <Typography.Title
                    style={{
                        marginTop: 0,
                        marginBottom: 16
                    }}
                    heading={6}
                >
                    {title}
                </Typography.Title>
            )}

            <ListFilter
                resource={resource}
                fields={filterFields}
                filterValues={filterValues}
                onChangeFilter={(values) => setFilterValues(values)}
            />
            <div className="actions">
                <ListCreateAction options={action?.create} showTableDrawer={showTableDrawer} />
            </div>

            {/* <Divider /> */}
            {/* <div> */}
            {showBatchAction ? (
                <Space>
                    <BatchSelectedIdsContextProvider value={selectedRowKeys}>
                        {/* {batchAction.delete && <ListBatchDeleteAction />} */}
                    </BatchSelectedIdsContextProvider>
                </Space>
            ) : (
                <Space>
                    {/* {action?.refresh && <ListRefreshAction />} */}

                    {/* {action?.export && <ListExportAction />} */}

                    {/* {action?.create && (
                        <Button
                            type="primary"
                            onClick={() => {
                                // showTableDrawer("edit", null)
                            }}
                        >
                            {t("tushan.list.create")}
                        </Button>
                    )} */}
                </Space>
            )}
            {/* </div> */}
        </Header>
    )

    const tableEl = (
        <Table
            loading={isLoading}
            columns={columns}
            data={list}
            rowKey={rowKey}
            rowSelection={rowSelection}
            components={tableComponents}
            pagination={{
                total,
                current: pageNum,
                pageSize,
                showTotal: props.showTotal ?? true,
                sizeCanChange: props.showSizeChanger ?? false,
                sizeOptions: [10, 20, 50, 100],
                onChange: (pageNum, pageSize) => {
                    setPageNum(pageNum)
                    setPageSize(pageSize)
                }
            }}
            onChange={(pagination, sorter) => {
                const _sorter = Array.isArray(sorter) ? sorter[0] : sorter

                if (!_sorter) {
                    setSort(undefined)
                    return
                }

                // If has sorter
                const { field, direction } = _sorter

                if (field && direction) {
                    setSort({
                        field: String(field),
                        order: direction === "ascend" ? "ASC" : "DESC"
                    })
                } else {
                    setSort(undefined)
                }
            }}
            {...props.tableProps}
        />
    )

    return (
        <ViewTypeContextProvider viewType="list">
            <ListTableContextProvider value={{ list, total, refetch }}>
                <ListParamsContextProvider value={listParams}>
                    <Card
                        style={{
                            borderRadius: 4
                            // padding: 20
                        }}
                        className={props.className}
                    >
                        {headerEl}

                        {/* {hasHeader && <Divider />} */}

                        {tableEl}

                        {drawerEl}
                    </Card>
                </ListParamsContextProvider>
            </ListTableContextProvider>
        </ViewTypeContextProvider>
    )
})

export const ListTable = connectRequestDataStore(_ListTable)

ListTable.displayName = "ListTable"