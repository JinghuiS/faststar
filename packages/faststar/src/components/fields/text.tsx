import { Input, Typography, type TypographyEllipsisProps } from "@arco-design/web-react"
import React from "react"
import { normalizeText } from "../../utils/common"
import { createFieldFactory } from "./factory"
import type { FieldDetailComponent, FieldEditComponent } from "./types"
import { useRequestDataStore } from "../../context/request-data-store"

export const TextFieldDetail: FieldDetailComponent<
    string,
    {
        ellipsis?: TypographyEllipsisProps
    }
> = React.memo((props) => {
    const v = useRequestDataStore((s) => s.data[props.source])
    const value = v ?? props.value

    if (props.options.ellipsis) {
        return (
            <Typography.Ellipsis {...props.options.ellipsis}>
                {normalizeText(value)}
            </Typography.Ellipsis>
        )
    }

    return <Typography.Text>{normalizeText(value)}</Typography.Text>
})
TextFieldDetail.displayName = "TextFieldDetail"

export const TextFieldEdit: FieldEditComponent<string> = React.memo((props) => {
    return (
        <Input
            allowClear
            placeholder={props.options.edit?.placeholder ?? props.options.label}
            value={normalizeText(props.value)}
            onChange={(val) => props.onChange(val)}
        />
    )
})
TextFieldEdit.displayName = "TextFieldEdit"

export const createTextField = createFieldFactory({
    detail: TextFieldDetail,
    edit: TextFieldEdit
})
