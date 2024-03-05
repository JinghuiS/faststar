import React from "react"
import { Button, Form, Input, Typography } from "@arco-design/web-react"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

import useLogin from "../../api/auth/useLogin"
import { useEvent } from "../../hooks/useEvent"
import { useSafeSetState } from "../../hooks/useSafeState"
import { Logo } from "../layout/Logo"

const Styled = styled.div`
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100vh;
    width: 100vw;
    background: #f0f2f5;
    .wrap {
        display: flex;
        justify-content: center;
        flex-direction: column;
        flex: 1;
        padding: 32px 0;
        .bg {
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            position: absolute;
        }
        .form-card {
            width: 400px;
            margin: 0 auto;
            border-radius: 10px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
            padding: 20px 20px 20px 20px;
            position: relative;
            z-index: 10;
            background: #fcfcfc;
            .img {
                width: 400px;
                margin-right: 50px;
            }
            .form-box {
                /* width: 250px; */
                /* margin: auto; */
            }
        }
    }
`

export const LoginPage: React.FC = () => {
    const login = useLogin()
    const { t } = useTranslation()
    const [loading, setLoading] = useSafeSetState(false)

    const submit = useEvent(async (values) => {
        setLoading(true)
        try {
            await login(values)
            setLoading(false)
        } catch (e) {
            setLoading(false)
        }
    })

    return (
        <Styled>
            <div className="wrap ">
                <div className="bg">
                    <svg
                        width="800"
                        height="800"
                        viewBox="0 0 1000 1000"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <filter id="grain" x="-50vw" y="-50vh" width="100vw" height="100vh">
                                <feFlood floodColor="#ffffff" result="neutral-gray" />

                                <feTurbulence
                                    in="neutral-gray"
                                    type="fractalNoise"
                                    baseFrequency="2.5"
                                    numOctaves="100"
                                    stitchTiles="stitch"
                                    result="noise"
                                />

                                <feColorMatrix
                                    in="noise"
                                    type="saturate"
                                    values="0"
                                    result="destaturatedNoise"
                                ></feColorMatrix>

                                <feComponentTransfer in="desaturatedNoise" result="theNoise">
                                    <feFuncA type="table" tableValues="0 0 0.25 0"></feFuncA>
                                </feComponentTransfer>

                                <feBlend
                                    in="SourceGraphic"
                                    in2="theNoise"
                                    mode="soft-light"
                                    result="noisy-image"
                                />
                            </filter>

                            <linearGradient
                                id="linearGradientId"
                                gradientTransform="rotate(60 0.5 0.5)"
                            >
                                <stop offset="0%" stopColor="#0093E9" />
                                <stop offset="100%" stopColor="#80D0C7" />
                            </linearGradient>

                            <clipPath id="shape">
                                <path
                                    fill="currentColor"
                                    d="M903,650.5Q859,801,716.5,861.5Q574,922,445,870.5Q316,819,214,730Q112,641,105,497.5Q98,354,187,232.5Q276,111,426,90Q576,69,688,158.5Q800,248,873.5,374Q947,500,903,650.5Z"
                                ></path>
                            </clipPath>
                        </defs>

                        <g filter="url(#grain)" clipPath="url(#shape)">
                            <path
                                fill="url(#linearGradientId)"
                                d="M903,650.5Q859,801,716.5,861.5Q574,922,445,870.5Q316,819,214,730Q112,641,105,497.5Q98,354,187,232.5Q276,111,426,90Q576,69,688,158.5Q800,248,873.5,374Q947,500,903,650.5Z"
                            />
                        </g>
                    </svg>
                </div>

                <div className="form-card">
                    <div
                        style={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: 20
                        }}
                    >
                        <Logo />
                        <Typography.Title
                            style={{
                                marginTop: 0,
                                marginBottom: 0,
                                marginLeft: 10
                            }}
                            heading={4}
                        >
                            {t("faststar.login.title")}
                        </Typography.Title>
                    </div>
                    <div className="form-box">
                        <Form wrapperCol={{ span: 24 }} onSubmit={submit}>
                            <Form.Item
                                field="username"
                                rules={[
                                    { required: true, message: t("faststar.login.noUsernameMsg") }
                                ]}
                            >
                                <Input
                                    autoComplete="username"
                                    style={{ width: "100%" }}
                                    placeholder={t("faststar.login.username")}
                                />
                            </Form.Item>
                            <Form.Item
                                field="password"
                                rules={[
                                    { required: true, message: t("faststar.login.noPasswordMsg") }
                                ]}
                            >
                                <Input
                                    autoComplete="password"
                                    style={{ width: "100%" }}
                                    type="password"
                                    placeholder={t("faststar.login.password")}
                                />
                            </Form.Item>
                            <Form.Item>
                                <Button htmlType="submit" type="primary" loading={loading} long>
                                    {t("faststar.login.login")}
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div>
            </div>
        </Styled>
    )
}
