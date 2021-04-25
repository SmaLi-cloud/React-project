import VoTable from '@/pages/components/voTable';
import React from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';


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
  const opCols= [
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
      dataIndex: 'key',
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
    },
    {
      title: 'opCols',
      key: 'opCols',
      fixed: 'right',
      width: 100,
      // render: () => <a>添加列</a>,
    },
  ];
  const paging = {
    pageSize: 10,
    current: 1,
    total: 50,
    pageSizeOptions: [5, 10, 20, 40]
  };
  const searchs = [
    {
      title: 'name',
      dataIndex: '',
      key: 'name',
      // type: 'datePicker',
      // type: 'input',
      type: 'select',
      colSpan:2,
      onclick: function () {
      }
    }, {
      title: 'age',
      dataIndex: '',
      key: 'age',
      type: 'input',
      colSpan:1,
    }, {
      title: 'sex',
      dataIndex: '',
      key: 'sex',
      type: 'select',
      colSpan:1,
    },
  ];
  const toolBar = [{
    title:'add',
    type: 'primary',
    key:'add',
    icon: <PlusOutlined />,
    onClick: () => {
      console.log('toolBar add click');
    },
  }, {
    title: 'edit',
    type: 'link',
    key:'edit',
    icon: <EditOutlined />,
    onClick: () => {
      console.log('toolBar edit click');
    },
  }];
  // const toolBar = ['edit', 'add']
  const tableConfig = {
    searchs,
    columns,
    opCols,
    toolBar,
    paging,
    dataSource,
    voPermission: "co.user.list",
  }

  return (
    <VoTable tableConfig={tableConfig} />
  );
};

export default TableList;
