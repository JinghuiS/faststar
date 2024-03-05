import React from "react"
import { ResourceContextProvider } from "../../context/resource"
import { ListTable, type ListTableProps } from "../list"
import { EditPage, type EditPageProps } from "../edit"
import { ListPage } from "../list/ListPage"
export interface CreateResourceFactoryReturn {
    list: React.ComponentType<any>
    create: React.ComponentType<any>
    edit: React.ComponentType<any>
    detail: React.ComponentType<any>
    name: string
    label: string
}
export interface CreateResourceFactoryConfig {
    name: string
    label?: string
    list: ListTableProps
    edit?: EditPageProps
    create?: EditPageProps
}

function makeListPage(config: CreateResourceFactoryConfig) {
    return () => {
        return (
            <ResourceContextProvider resourceName={config.name}>
                <ListPage {...config.list} />
            </ResourceContextProvider>
        )
    }
}

function makeCreatePage(config: CreateResourceFactoryConfig) {
    return () => {
        return (
            <ResourceContextProvider resourceName={config.name}>
                <EditPage
                    fields={config.list.fields}
                    {...config.edit}
                    {...config.create}
                    isCreate
                />
            </ResourceContextProvider>
        )
    }
}

function makeEditPage(config: CreateResourceFactoryConfig) {
    return () => {
        return (
            <ResourceContextProvider resourceName={config.name}>
                <EditPage fields={config.list.fields} {...config.edit} />
            </ResourceContextProvider>
        )
    }
}

function makeDetailPage(config: CreateResourceFactoryConfig) {
    return () => {
        return <ResourceContextProvider resourceName={config.name}></ResourceContextProvider>
    }
}

export function createResourceFactory(
    config: CreateResourceFactoryConfig
): CreateResourceFactoryReturn {
    return {
        list: makeListPage(config),
        create: makeCreatePage(config),
        edit: makeEditPage(config),
        detail: makeDetailPage(config),
        name: config.name,
        label: config.label ?? config.name
    }
}
