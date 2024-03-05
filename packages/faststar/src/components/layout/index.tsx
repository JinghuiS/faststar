import React, { useState } from "react"
import { Layout } from "@arco-design/web-react"
// import { Navbar } from "./Navbar"
import { Sidebar } from "./Sidebar"
// import { TushanBreadcrumb } from "./Breadcrumb"
import { Outlet } from "react-router-dom"
import styled from "styled-components"
import { useTranslation } from "../../i18n"
import { useFaststarContext } from "../../context/faststar"
import { NavBar } from "./NavBar"
// import { useTushanContext } from "../../context/tushan"
const navbarHeight = 60
const Sider = Layout.Sider
const Header = Layout.Header
const Footer = Layout.Footer
const Content = Layout.Content

const Root = styled(Layout)`
    height: 100vh;
    width: 100%;
    overflow-y: auto;
    min-height: 100%;

    .header {
        position: fixed;
        width: 100%;
        top: 0;
        left: 0;
        z-index: 100;

        min-width: 1100px;
        height: ${navbarHeight}px;
    }

    .sider {
        position: fixed;
        left: 0;
        top: 0;
        height: 100%;
        z-index: 99;
    }

    .content {
        min-height: 100vh;
        min-width: 1100px;
        background-color: var(--color-fill-2);
        /* padding: 1rem; */
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        transition-duration: 150ms;

        .body {
            /* padding: 16px 20px 0; */
            flex: 1;
        }

        .footer {
            text-align: center;
            color: rgb(107 114 128);
            font-size: 0.75rem;
            line-height: 1rem;
            margin-top: 1rem;
        }
    }
`

export const BasicLayout: React.FC = React.memo((props) => {
    const [collapsed, setCollapsed] = useState(false)
    const menuWidth = collapsed ? 48 : 220
    const { t } = useTranslation()
    const { footer } = useFaststarContext()

    return (
        <Root className="basic-layout">
            <Header className="header">
                <NavBar />
            </Header>

            <Layout>
                <Sider
                    style={{ paddingTop: navbarHeight }}
                    width={220}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(collapse) => setCollapsed(collapse)}
                    breakpoint="lg"
                    className="sider"
                >
                    <Sidebar />
                </Sider>
                <Layout
                    className="content"
                    style={{
                        paddingLeft: menuWidth,
                        paddingTop: navbarHeight
                    }}
                >
                    {/* <TushanBreadcrumb /> */}
                    <Content className="body">
                        <Outlet />
                    </Content>
                    <Footer className="footer">{footer ?? t("faststar.footer.title")}</Footer>
                </Layout>
            </Layout>
        </Root>
    )
})
BasicLayout.displayName = "BasicLayout"
