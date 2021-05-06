import VoTable from '@/pages/components/VoTable';
import React, { useState, useRef } from 'react';
import { Modal, Form, TreeSelect, Input, Button, message, Breadcrumb, Card } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/Tools';
import { PageContainer } from '@ant-design/pro-layout';

const dictionaryList = () => {

  return (
    <>
      <PageContainer
        header={{
          title: '字典管理',
          breadcrumb: {
            routes: [{ breadcrumbName: '系统管理' }, { breadcrumbName: '当前页面' }]
          }
        }}
      >
          <Card>
            
          </Card>
      </PageContainer>
    </>
  );
};

export default dictionaryList;
