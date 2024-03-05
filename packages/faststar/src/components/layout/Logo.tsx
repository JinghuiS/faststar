import React from "react"
import styled from "styled-components"

const Styled = styled.div`
    border-radius: 50%;
    display: flex;
    align-items: center;
    width: 29px;
    height: 29px;
    /* width: 200px; */

    box-sizing: border-box;
    padding: 4px;
    background: #3139fbff;
    color: #fdfdffff;
`

export const Logo = () => {
    return (
        <Styled>
            <svg
                xmlns="http://www.w3.org/2000/svg"
                // class="icon icon-tabler icon-tabler-feather"
                width="25"
                height="25"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 20l10 -10m0 -5v5h5m-9 -1v5h5m-9 -1v5h5m-5 -5l4 -4l4 -4" />
                <path d="M19 10c.638 -.636 1 -1.515 1 -2.486a3.515 3.515 0 0 0 -3.517 -3.514c-.97 0 -1.847 .367 -2.483 1m-3 13l4 -4l4 -4" />
            </svg>
        </Styled>
    )
}
