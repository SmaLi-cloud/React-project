import React from 'react';
import ProTable from '@ant-design/pro-table';
import { logMsg } from '@/utils/Tools';

const columns = [
    {
        dataIndex: 'key',
        valueType: 'indexBorder',
        width: 48,
    },
    {
        title: '标题',
        dataIndex: 'name',
        tip: '标题过长会自动收缩',
        formItemProps: {
            rules: [
                {
                    required: true,
                    message: '此项为必填项',
                },
            ],
        },
    },
    {
        title: '状态',
        dataIndex: 'age',
        valueType: 'select',
        valueEnum: {
            all: { text: '全部', status: 'Default' },
            open: {
                text: '未解决',
                status: 'Error',
            },
            closed: {
                text: '已解决',
                status: 'Success',
                disabled: true,
            },
            processing: {
                text: '解决中',
                status: 'Processing',
            },
        },
    },
    {
        title: '标签',
        dataIndex: 'address',
        search: false,
    }
];

export default () => {
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
    return (<ProTable dataSource = {dataSource} columns={columns} request={(parmas)=> logMsg(parmas)}/>);
};