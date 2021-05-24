import { Tooltip, Tag } from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import React from 'react';
import { SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
import HeaderSearch from '../HeaderSearch';
import styles from './index.less';
const ENVTagColor = {
  dev: 'orange',
  test: 'green',
  pre: '#87d068',
};

const GlobalHeaderRight = () => {
  let className = styles.right;
  return (
    <div className={className}>
      <HeaderSearch
        className={`${styles.action} ${styles.search}`}
        placeholder="站内搜索"
        defaultValue=""
        // options={[
        //   {
        //     label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>,
        //     value: 'umi ui',
        //   },
        // ]}
        onSearch={value => {
          console.log(value);
        }}
      />
      <Tooltip title="GitHub">
        <a
          style={{
            color: 'inherit',
          }}
          target="_blank"
          // href="https://github.com/SmaLi-cloud/React-project"
          rel="noopener noreferrer"
          className={styles.action}
        >
          <QuestionCircleOutlined />
        </a>
      </Tooltip>
      <Avatar />
      {REACT_APP_ENV && (
        <span>
          <Tag color={ENVTagColor[REACT_APP_ENV]}>{REACT_APP_ENV}</Tag>
        </span>
      )}
      <SelectLang className={styles.action} />
    </div>
  );
};

export default GlobalHeaderRight