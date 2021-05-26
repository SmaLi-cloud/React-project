import { Tag } from 'antd';
import React from 'react';
import { SelectLang } from 'umi';
import Avatar from './AvatarDropdown';
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