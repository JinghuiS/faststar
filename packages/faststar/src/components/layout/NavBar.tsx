import React from "react"
import styled from "styled-components"

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
        display: flex;
        align-items: center;
        width: 200px;
        padding-left: 20px;
        box-sizing: border-box;
    }

    .logo-name {
        color: var(--color-text-1);
        font-weight: 500;
        font-size: 20px;
        margin-left: 10px;
        font-family: "PingFang SC";
    }
`

export const NavBar: React.FC = () => {
    return (
        <NavBarBox>
            <div className="left">
                <div className="logo-name">Faststar</div>
            </div>
        </NavBarBox>
    )
}
