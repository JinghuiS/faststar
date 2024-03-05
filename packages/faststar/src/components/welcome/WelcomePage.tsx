import { Typography } from "@arco-design/web-react"
import React from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import { WelcomeIllustration } from "./WelcomeIllustration"

const Styled = styled.div`
    height: 100%;
    background: var(--color-bg-1);
    padding: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    .page-container {
        margin: 0 134px;
        max-width: 840px;
    }
`

export const WelcomePage = () => {
    const { t } = useTranslation()

    return (
        <Styled>
            <div className="page-container">
                <Typography.Title style={{ textAlign: "center" }} heading={3}>
                    {t("faststar.welcome.title")}
                </Typography.Title>
                <WelcomeIllustration />
            </div>
        </Styled>
    )
}
