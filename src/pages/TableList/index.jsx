import VoTable from '@/pages/components/VoTable';
import React, { useRef  } from 'react';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/Tools';

const tableList = () => {

  const opCols = [
    {
      key: 'add',
      title: "添加",
      type: "button",
      onClick: function (recode) {
        console.log(recode)
      },
      width:80
    },
    {
      key: 'edit',
      title: "修改",
      type: "link",
      onClick: function () {
        console.log("edit click")
      },
      width:80
    }
  ]
  const columns = [
    {
      title: 'name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'level',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: 'orderNo',
      dataIndex: 'orderNo',
      key: 'orderNo',
    },
  ];
  const paging = {
    pageSize: 10,
    current: 1,
    total: 0,
    pageSizeOptions: [5, 10, 20, 40]
  };
  const searchs = [
    {
      title: 'name',
      dataIndex: '',
      key: 'name',
      type: 'input',
      colSpan: 1,
      defaultValue: "",
      placeholder: "",
      dataSource: [],//string，[]
      //取数据的方式
    }, {
      title: 'code',
      dataIndex: '',
      key: 'code',
      type: 'input',
      colSpan: 1,
    }, {
      title: 'level',
      dataIndex: '',
      key: 'level',
      type: 'select',
      colSpan: 1,
    },
  ];
  const toolBar = [{
    title: 'add',
    type: 'primary',
    key: 'add',
    icon: <PlusOutlined />,
    onClick: () => {
      console.log('toolBar add click');
    },
  }, {
    title: 'edit',
    type: 'link',
    key: 'edit',
    icon: <EditOutlined />,
    onClick: () => {
      console.log('toolBar edit click');
    },
  }];
  const onSelectChange = (selectedRowKeys) => {
    Tools.logMsg(selectedRowKeys);
  }
  const tableConfig = {
    searchs,
    columns,
    opCols,
    toolBar,
    paging,
    dataSource: 'sys.permission:search',
    otherConfig: {
      rowKey: "id",
      rowSelection: {
        type: 'checkbox',
        onChange: onSelectChange
      },
      bordered:true
    },
    voPermission: "sys.staff.list",
  };
const table = useRef();
const onClick = ()=>{
  console.log(table);
table.current.refreshData(1);
}
  return (
    <>
    <VoTable {...tableConfig} ref = {table} />
    <button onClick={onClick}>sss</button>
    </>
  );
};

export default tableList;
