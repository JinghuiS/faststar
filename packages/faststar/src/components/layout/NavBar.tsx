import React, { useMemo } from "react"
import styled from "styled-components"
import { Logo } from "./Logo"
import { useUserStore } from "../../store/user"
import { createSelector } from "../../utils/createSelector"
import { Button, Divider, Dropdown, Menu, Typography } from "@arco-design/web-react"
import { IconUser } from "@arco-design/web-react/icon"
import { useTranslation } from "react-i18next"
import { useLogout } from "../../api/auth/useLogout"

// from https://github.com/arco-design/arco-design-pro/blob/main/arco-design-pro-next/src/components/NavBar/index.tsx

const NavBarBox = styled.div`
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--color-border);
    box-sizing: border-box;
    background-color: var(--color-bg-2);
    height: 100%;

    .left {
        display: flex;
        align-items: center;
    }
    .logo {
        margin-left: 20px;
    }

    .logo-name {
        color: var(--color-text-1);
        font-weight: 500;
        font-size: 20px;
        margin-left: 10px;
        font-family: "PingFang SC";
    }
    .right {
        display: flex;
        align-items: center;
        margin-left: auto;
        margin-right: 20px;
    }
`

export const NavBar: React.FC = () => {
    const { userIdentity } = useUserStore(createSelector("userIdentity"))
    const logout = useLogout()
    const { t } = useTranslation()
    const dropList = useMemo(() => {
        return (
            <Menu onClickMenuItem={(key) => key === "logout" && logout()}>
                {userIdentity.fullName && (
                    <>
                        <div
                            style={{
                                textAlign: "center"
                            }}
                        >
                            <Typography.Text>{userIdentity.fullName}</Typography.Text>
                        </div>
                        <Divider style={{ margin: "4px 0" }} />
                    </>
                )}
                <Menu.Item key="logout">{t("faststar.header.logout")}</Menu.Item>
            </Menu>
        )
    }, [userIdentity])

    return (
        <NavBarBox>
            <div className="left">
                <div className="logo">
                    <Logo />
                </div>
                <div className="logo-name">Faststar</div>
            </div>
            <div className="right">
                <Dropdown droplist={dropList}>
                    <Button icon={<IconUser />} shape="circle" />
                </Dropdown>
                {/* {userIdentity.fullName} */}
            </div>
        </NavBarBox>
    )
}
