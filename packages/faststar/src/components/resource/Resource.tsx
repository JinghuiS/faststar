import React, { isValidElement } from "react"
import { Route, Routes } from "react-router-dom"
import { ResourceContextProvider } from "../../context/resource"

export interface ResourceProps extends React.PropsWithChildren {
    name: string
    label?: string
    icon?: React.ReactElement
    list?: React.ComponentType<any> | React.ReactElement
    create?: React.ComponentType<any> | React.ReactElement
    edit?: React.ComponentType<any> | React.ReactElement
    detail?: React.ComponentType<any> | React.ReactElement
}
export const Resource: React.FC<ResourceProps> = React.memo((props) => {
    const { create: Create, detail: Detail, list: List, edit: Edit } = props

    const CreateComp = Create as React.ComponentType<any>
    const DetailComp = Detail as React.ComponentType<any>
    const ListComp = List as React.ComponentType<any>
    const EditComp = Edit as React.ComponentType<any>

    return (
        <ResourceContextProvider resourceName={props.name}>
            <Routes>
                {List && <Route path={`/*`} element={isValidElement(List) ? List : <ListComp />} />}

                {Create && (
                    <Route
                        path={`create/*`}
                        element={isValidElement(Create) ? Create : <CreateComp />}
                    />
                )}
                {Detail && (
                    <Route
                        path={`:id/detail/*`}
                        element={isValidElement(Detail) ? Detail : <DetailComp />}
                    />
                )}
                {Edit && (
                    <Route path={`:id/*`} element={isValidElement(Edit) ? Edit : <EditComp />} />
                )}

                {props.children}
            </Routes>
        </ResourceContextProvider>
    )
})
Resource.displayName = "Resource"
