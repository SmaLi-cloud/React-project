/**
 * Ant Design Pro v4 use `@ant-design/pro-layout` to handle Layout.
 *
 * @see You can view component api by: https://github.com/ant-design/ant-design-pro-layout
 */
import ProLayout, { DefaultFooter } from '@ant-design/pro-layout';
import React, { useMemo, useRef, useState } from 'react';
import { Link, useIntl, history } from 'umi';
import { GithubOutlined } from '@ant-design/icons';
import { Result, Button, Spin } from 'antd';
import { Authorized } from '@/utils/setMenuAuthority';
import RightContent from '@/components/GlobalHeader/RightContent';
import { getMatchMenu } from '@umijs/route-utils';
import logo from '../assets/logo.svg';
import * as Tools from '@/utils/tools';

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

/** Use Authorized check all menu item */
const menuDataRender = (menuList) =>
  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null);
  });
const defaultFooterDom = (
  <DefaultFooter
    copyright={`${new Date().getFullYear()} 捷配物联网`}
    links={[
      {
        key: 'github',
        title: <GithubOutlined />,
        href: 'https://github.com/SmaLi-cloud/React-project',
        blankTarget: true,
      }
    ]}
  />
);

const BasicLayout = (props) => {
  const [isShowMask, setIsShowMask] = useState(false);
  const {
    children,
    settings,
    location = {
      pathname: '/',
    },
  } = props;
  const menuDataRef = useRef([]);

  const authorized = useMemo(
    () =>
      getMatchMenu(location.pathname || '/', menuDataRef.current).pop() || {
        authority: undefined,
      },
    [location.pathname],
  );

  Tools.addListener('setMaskState', 'basicLayout', (state) => {
    setIsShowMask(state);
  })

  const { formatMessage } = useIntl();
  return (
    <Spin spinning={isShowMask}>
      <ProLayout
        logo={logo}
        formatMessage={formatMessage}
        {...props}
        {...settings}
        onMenuHeaderClick={() => history.push('/')}
        menuItemRender={(menuItemProps, defaultDom) => {
          if (
            menuItemProps.isUrl ||
            !menuItemProps.path ||
            location.pathname === menuItemProps.path
          ) {
            return defaultDom;
          }
          return <Link to={menuItemProps.path}>{defaultDom}</Link>;
        }}
        footerRender={() => defaultFooterDom}
        menuDataRender={menuDataRender}
        rightContentRender={() => <RightContent />}
        postMenuData={(menuData) => {
          menuDataRef.current = menuData || [];
          return menuData || [];
        }}
      >
        <Authorized authority={authorized.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>
    </Spin>

  );
};

export default BasicLayout;