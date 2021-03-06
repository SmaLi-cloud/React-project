import {
    LockOutlined,
    MailOutlined,
    MobileOutlined,
    UserOutlined,
} from '@ant-design/icons';
import { Alert, message, Tabs, Input, Row, Col } from 'antd';
import React, { useState, useEffect } from 'react';
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

    const [checkCodeUrl, setCheckCodeUrl] = useState("");
    const [type, setType] = useState('account');
    const [submit, setSubmit] = useState(false);
    const intl = useIntl();

    const successCallback = (result) => {
        if (!result.success) {
            Tools.showMessage("登录失败", result.msg, 'error');
            setSubmit(false)
            changeCheckCode();
            return;
        }
        const { data } = result;
        Storage.set('voToken', data.voToken)
        Storage.set('staffInfo', [{ staffId: data.staffId, trueName: data.trueName }])
        Storage.set('allPermissions', data.allPermissions)
        Storage.set('userPermissions', data.userPermissions)
        setMenuAuthority()
        const params = Tools.getPageQuery();
        let { redirect } = params;
        if (redirect) {
            const urlParams = new URL(window.location.href);
            const redirectUrlParams = new URL(redirect);
            if (redirectUrlParams.origin === urlParams.origin) {
                window.location.href = redirectUrlParams
            }
        } else {
            window.location.href = '/cus/thirdPartySystem'
        }
    }
    const errorCallback = (result) => {
        Tools.showMessage('登陆失败', result.msg)
        setSubmit(false)
    }
    const changeCheckCode = () => {
        Tools.callAPI('sys.verification_code:get_code', {}, (result) => {
            if (result.success) {
                Storage.set('voToken', result.data.voToken);
                setCheckCodeUrl("data:image/jpg;base64," + result.data.imgData);
            }
        });
    }
    useEffect(() => {
        changeCheckCode();
    }, []);
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
                        size: 'large',
                        style: {
                            width: '100%',
                        },
                    },
                }}
                onFinish={(values) => {
                    setSubmit(true)
                    Tools.callAPI('co.staff:login', values, successCallback, errorCallback)
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
                </Tabs>

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
                            placeholder='请输入账号'
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
                            placeholder='请输入密码'
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
                            <Col span="16">
                                <ProFormText name="checkCode" fieldProps={{ size: 'large' }} className={styles.antdInput} placeholder="输入验证码" />
                            </Col>
                            <Col span="8">
                                <img src={checkCodeUrl} onClick={changeCheckCode} alt="" className={styles.checkCode} />
                            </Col>
                        </Row>
                    </>
                )}
            </ProForm>
        </div>
    );
};

export default Login;