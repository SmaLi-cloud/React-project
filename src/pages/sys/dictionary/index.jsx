import VoTable from '@/pages/components/VoTable';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, TreeSelect, Input, Button, message, notification,Card } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import { PageContainer } from '@ant-design/pro-layout';

const dictionaryList = () => {


  const searchs = [
    {
      title: '名称',
      dataIndex: '',
      key: 'name',
      type: 'input',
      colSpan: 1,
      defaultValue: "",
      placeholder: "",
      dataSource: [],//string，[]
      //取数据的方式
    }
  ];
  const columns = [
    {
      title: '类型',
      dataIndex: 'typeNames',
      key: 'itemName',
    },
    {
      title: '名称',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: '类型名',
      dataIndex: 'typeCode',
      sorter:true,
      key: 'typeCode',
    },
    {
      title: '排序',
      dataIndex: 'orderNo',
      sorter:true,
      key: 'orderNo',
    },
  ];
  const paging = {
    pageSize: 10,
    current: 1,
    total: 50,
    pageSizeOptions: [5, 10, 20, 40]
  };
  const toolBar = [
    {
      title: '添加部门',
      type: 'primary',
      key: 'add',
      icon: <PlusOutlined />,
      onClick: ()=>{}
    }];
  const opCols = [
    {
      key: 'edit',
      title: "修改",
      type: "link",
      icon: <EditOutlined />,
      onClick:()=>{},
      width: 100
    },
    {
      key: 'delete',
      title: "删除",
      type: "link",
      icon: <DeleteOutlined />,
      onClick: function () {},
      width: 100
    }
  ]

  const tableConfig = {
    columns,
    paging,
    searchs,
    opCols,
    toolBar,
    dataSource: 'sys.dictionary:search',
    otherConfig: {
      rowKey: "id",
      bordered: true,
    },
    voPermission: "sys.staff.list",
  };

  // useEffect(() => {
  //   Tools.callAPI('sys.dictionary:search', { conditions: {}, page: 1, size: 10000 }, (result) => {
  //     if (result.success) {
  //       Tools.logMsg(result)
  //     }
  //   });
  // }, []);

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
          <VoTable {...tableConfig} />
      </PageContainer>
    </>
  );
};

export default dictionaryList;


