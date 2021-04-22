import VoTable from '@/pages/components/voTable';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';

const TableList = () => {
  const dataSource = [
    {
      key: '1',
      name: '胡彦斌',
      age: 32,
      address: '西湖区湖底公园1号',
    },
    {
      key: '2',
      name: 'hellokitty',
      age: 42,
      address: '西湖区湖底公园1号',
    },
  ];

  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'operations',
      dataIndex: 'id',
      key: 'operations',
      operations: [
        {
          key: 'add',
          title: "添加",
          type: "button",
          onClick: function () {
            console.log("add click")
          }
        },
        {
          key: 'edit',
          title: "修改",
          type: "link",
          onClick: function () {
            console.log("edit click")
          }
        }
      ]
    }
  ];

  const tableConfig = {
    search:[],
    columns,
    operations:[],
    toolbar:[],
    paging:{},
    dataSource,
    voPermission: "co.user.list"
  }

  return (
      <VoTable tableConfig={tableConfig} />

  );
};

export default TableList;
