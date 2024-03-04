import React, { useMemo } from "react"
import { Button, Tooltip } from "@arco-design/web-react"
import { IconPlus } from "@arco-design/web-react/icon"
import { useTranslation } from "react-i18next"
import type { ViewType } from "../../../context/viewtype"
import type { BasicRecord } from "../../../api"
import type { ListTableActionItemType } from "../ListTable"
import { isBoolean, isFunction, isObject } from "lodash-es"
import { useAclStoreState } from "../../../store/acl"
import { createSelector } from "../../../utils/createSelector"
import { useResourceContext } from "../../../context/resource"
import { useNavigate } from "react-router-dom"
import { useCreatePath } from "../../../hooks/useCreatePath"

export type ListCreateActionProps = {
    showTableDrawer?: (viewType: ViewType, record: any) => void

    // visible?: boolean | ((viewType: ViewType) => boolean)
    options?:
        | {
              visible:
                  | boolean
                  | ((props: { accessControlList: string[]; resource: string }) => boolean)
              type?: ListTableActionItemType
          }
        | boolean
}

export const ListCreateAction: React.FC<ListCreateActionProps> = (props) => {
    const { showTableDrawer, options } = props
    const resourceContext = useResourceContext()
    const navigate = useNavigate()
    const createPath = useCreatePath()
    const { t } = useTranslation()
    const { accessControlList } = useAclStoreState(createSelector("accessControlList"))

    const visible = useMemo(() => {
        if (isBoolean(options)) {
            return options
        }

        if (isObject(options)) {
            if (isFunction(options.visible)) {
                return options.visible({ accessControlList, resource: resourceContext })
            }

            return options.visible
        }
    }, [options])

    return (
        <>
            {visible && (
                <Tooltip content={t("faststar.list.create")}>
                    <Button
                        type="primary"
                        icon={<IconPlus />}
                        onClick={() => {
                            if (isObject(options)) {
                                if (options.type === "page") {
                                    return navigate(
                                        createPath({
                                            type: "create",
                                            resource: resourceContext
                                            // id: record.id
                                        })
                                    )
                                }
                            }

                            if (showTableDrawer) {
                                showTableDrawer("create", null)
                            }
                        }}
                    >
                        {t("faststar.list.create")}
                    </Button>
                </Tooltip>
            )}
        </>
    )
}

ListCreateAction.displayName = "ListCreateAction"
