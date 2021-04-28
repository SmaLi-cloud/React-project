import { DefaultFooter, getPageTitle } from '@ant-design/pro-layout';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { SelectLang, useIntl, FormattedMessage } from 'umi';
import { GithubOutlined } from '@ant-design/icons'
import React from 'react';
import logo from '../assets/logo.png';
import styles from './UserLayout.less';
import Login from '@/pages/User/login'

const UserLayout = () => {

  const { formatMessage } = useIntl();
  const title = getPageTitle({
    pathname: location.pathname,
    formatMessage,
  });
  return (
    <HelmetProvider>
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={title} />
      </Helmet>

      <div className={styles.container}>
        <div className={styles.lang}>
          <SelectLang />
        </div>
        <div className={styles.content}>
          <div className={styles.top}>
            <div className={styles.header}>
              <img alt="logo" className={styles.logo} src={logo} />
              <span className={styles.title}>物联网管理平台</span>
            </div>
            <div className={styles.desc}>
              <FormattedMessage
                id="pages.layouts.userLayout.title"
                defaultMessage="hello"
              />
            </div>
          </div>
          <Login />
        </div>
        <DefaultFooter
          copyright={`${new Date().getFullYear()} 捷配物联网`}
          links={[
            {
              key: 'github',
              title: <GithubOutlined />,
            }
          ]}
        />
      </div>
    </HelmetProvider>
  );
};

export default UserLayout
