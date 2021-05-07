import {
    LockOutlined,
    MailOutlined,
    MobileOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Alert, message, Tabs, Input, Row, Col } from 'antd';
import React, { useState } from 'react';
import ProForm, { ProFormCaptcha, ProFormText } from '@ant-design/pro-form';
import { useIntl, FormattedMessage } from 'umi';
import styles from './index.less';
import * as Tools from '@/utils/tools';
import Storage from '@/utils/storage'
import setMenuAuthority from "@/utils/setMenuAuthority";

const LoginMessage = ({ content }) => (
    <>
        <Alert
            message="Error"
            description={content}
            type="error"
            showIcon
        />
    </>
);

const Login = () => {
    const successCallback = (result) => {
        const {data} = result;
        Storage.set('voToken', data.voToken)
        Storage.set('staffId', data.staffId)
        Storage.set('allPermissions', data.allPermissions)
        Storage.set('userPermissions', data.userPermissions)
        setMenuAuthority()
        const params = Tools.getPageQuery();
        let { redirect } = params;
        if (redirect) {
            const urlParams = new URL(window.location.href);
            const redirectUrlParams = new URL(redirect);
            Tools.logMsg(urlParams.origin) // http://localhost:8000
            if (redirectUrlParams.origin === urlParams.origin) { // true 
                window.location.href = redirectUrlParams
            }
        }else {
            window.location.href = 'http://localhost:8000/welcome'
        }
    }

    const errorCallback = (result) => {
        Tools.logMsg(result)
        const {data} = result;
        setSubmit(false)
        setMsg(data.msg)
    }

    const [type, setType] = useState('account');
    const [submit, setSubmit] = useState(false);
    const [msg, setMsg] = useState(null);
    const intl = useIntl();
    return (
        <div className={styles.main}>
            <ProForm
                initialValues={{
                    autoLogin: true,
                }}
                submitter={{
                    searchConfig: {
                        submitText: '点击登录',
                    },
                    render: (_, dom) => dom.pop(),
                    submitButtonProps: {
                        loading: submit,
                        // loading: false,
                        size: 'large',
                        style: {
                            width: '100%',
                        },
                    },
                }}
                onFinish={(values) => {
                    setSubmit(true)
                    Tools.logMsg(values);

                    Tools.callAPI('co.staff:login', { ...values }, successCallback, errorCallback)
                    // setMenuAuthority()
                    // successCallback()
                    // errorCallback()
                }}
            >
                <Tabs activeKey={type} onChange={setType}>
                    <Tabs.TabPane
                        key="account"
                        tab={intl.formatMessage({
                            id: 'pages.login.accountLogin.tab',
                            defaultMessage: '账户密码登录',
                        })}
                    />
                    <Tabs.TabPane
              key="mobile"
              tab={intl.formatMessage({
                id: 'pages.login.phoneLogin.tab',
                defaultMessage: '手机号登录',
              })}
            />
                </Tabs>
                {
                    msg && (
                        <LoginMessage
                            content={msg}
                        />
                    )
                }
                {status === 'error' && loginType === 'account' && !submitting && (
                    <LoginMessage
                        content={intl.formatMessage({
                            id: 'pages.login.accountLogin.errorMessage',
                            defaultMessage: '账户或密码错误（admin/ant.design)',
                        })}
                    />
                )}
                {type === 'account' && (
                    <>
                        <ProFormText
                            name="loginName"
                            fieldProps={{
                                size: 'large',
                                prefix: <UserOutlined className={styles.prefixIcon} />,
                            }}
                            placeholder={intl.formatMessage({
                                id: 'pages.login.username.placeholder',
                                defaultMessage: '用户名: admin or user',
                            })}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <FormattedMessage
                                            id="pages.login.username.required"
                                            defaultMessage="请输入用户名!"
                                        />
                                    ),
                                },
                            ]}
                        />
                        <ProFormText.Password
                            name="password"
                            fieldProps={{
                                size: 'large',
                                prefix: <LockOutlined className={styles.prefixIcon} />,
                            }}
                            placeholder={intl.formatMessage({
                                id: 'pages.login.password.placeholder',
                                defaultMessage: '密码: ant.design',
                            })}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <FormattedMessage
                                            id="pages.login.password.required"
                                            defaultMessage="请输入密码！"
                                        />
                                    ),
                                },
                            ]}
                        />
                        <Row className={styles.antRow}>
                            <Col span="18">
                                <Input className={styles.antdInput} placeholder="输入验证码"/>
                            </Col>
                            <Col span="6" className={styles.bacimg}>
                                  <img  src="" alt=""/>
                            </Col>
                        </Row>
                    </>
                )}

                {status === 'error' && loginType === 'mobile' && !submitting && (
                    <LoginMessage content="验证码错误" />
                )}
                {type === 'mobile' && (
                    <>
                        <ProFormText
                            fieldProps={{
                                size: 'large',
                                prefix: <MobileOutlined className={styles.prefixIcon} />,
                            }}
                            name="mobile"
                            placeholder={intl.formatMessage({
                                id: 'pages.login.phoneNumber.placeholder',
                                defaultMessage: '手机号',
                            })}
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <FormattedMessage
                                            id="pages.login.phoneNumber.required"
                                            defaultMessage="请输入手机号！"
                                        />
                                    ),
                                },
                                {
                                    pattern: /^1\d{10}$/,
                                    message: (
                                        <FormattedMessage
                                            id="pages.login.phoneNumber.invalid"
                                            defaultMessage="手机号格式错误！"
                                        />
                                    ),
                                },
                            ]}
                        />
                        <ProFormCaptcha
                            fieldProps={{
                                size: 'large',
                                prefix: <MailOutlined className={styles.prefixIcon} />,
                            }}
                            captchaProps={{
                                size: 'large',
                            }}
                            placeholder={intl.formatMessage({
                                id: 'pages.login.captcha.placeholder',
                                defaultMessage: '请输入验证码',
                            })}
                            captchaTextRender={(timing, count) => {
                                if (timing) {
                                    return `${count} ${intl.formatMessage({
                                        id: 'pages.getCaptchaSecondText',
                                        defaultMessage: '获取验证码',
                                    })}`;
                                }

                                return  <img src="https://img1.baidu.com/it/u=2496571732,442429806&fm=26&fmt=auto&gp=0.jpg" alt="" className={styles.antBtnLg}/>
                            }}
                            name="captcha"
                            rules={[
                                {
                                    required: true,
                                    message: (
                                        <FormattedMessage
                                            id="pages.login.captcha.required"
                                            defaultMessage="请输入验证码！"
                                        />
                                    ),
                                },
                            ]}
                            onGetCaptcha={async (mobile) => {
                                const result = await getFakeCaptcha(mobile);

                                if (result === false) {
                                    return;
                                }

                                message.success('获取验证码成功！验证码为：1234');
                            }}
                        />
                    </>
                )}
            </ProForm>
        </div>
    );
};

export default Login;