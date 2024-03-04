import React from "react"
import type { FaststarCategoryPathInfo } from "../store/menu"
import { createContextFactory } from "../utils/context"

export const { Provider: CategoryContextProvider, useContext: useCategoryContext } =
    createContextFactory<FaststarCategoryPathInfo[]>([], "CategoryContext")

export type CategoryProps = React.PropsWithChildren<FaststarCategoryPathInfo>

/**
 * Category for route
 *
 * Wrapper above <Resource /> and <CustomRoute />
 */
export const Category: React.FC<CategoryProps> = React.memo((props) => {
    const { children, ...currPath } = props
    const prevPath = useCategoryContext()

    return (
        <CategoryContextProvider value={[...prevPath, currPath]}>
            {children}
        </CategoryContextProvider>
    )
})
Category.displayName = "Category"
