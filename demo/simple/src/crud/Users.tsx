import { createResourceFactory, createTextField } from "faststar"
export const Users = createResourceFactory({
    list: {
        title: "用户列表",
        filter: [
            createTextField("name", {
                label: "名字"
            }),

            createTextField("username", {
                label: "Username"
            }),
            createTextField("website", {
                label: "Website"
            })
        ],
        fields: [
            createTextField("id", {
                label: "ID"
            }),
            createTextField("name", {
                span: 12,
                label: "name"
            }),

            createTextField("username", {
                label: "Username",
                span: 12
            }),
            createTextField("website", {
                label: "Website"
            }),
            createTextField("email", {
                label: "Email"
            })
        ],
        action: {
            create: {
                type: "page",
                visible: true
            },
            delete: true,
            detail: true,
            edit: {
                type: "page",
                visible: true
            }
        }
    },
    edit: {
        gutter: 16
    },
    name: "users",
    label: "用户管理"
})
