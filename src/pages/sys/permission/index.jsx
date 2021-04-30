import VoTable from '@/pages/components/VoTable';
import React, { useState, useRef } from 'react';
import { Modal, Form, TreeSelect, Input } from 'antd';
import { EditOutlined, PlusOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/Tools';

const tableList = () => {
  const formRef = useRef();
  const table = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [treeValue, setTreeValue] = useState("");
  const [treeData, setTreeData] = useState([]);

  const opCols = [
    {
      key: 'add',
      title: "修改",
      type: "button",
      onClick: function (recode) {
        console.log(recode)
      },
      width: 80
    },
    {
      key: 'edit',
      title: "删除",
      type: "link",
      onClick: function () {
        console.log("edit click")
      },
      width: 80
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
    total: 50,
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
    onClick: (dataSource) => {
      console.log(dataSource);
      let treeData = Tools.buildTree(dataSource, 'id', 'parentId', 'children', "")
      setTreeData(treeData)
      setIsModalVisible(true)
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


  const onTreeSelect = (_, node) => {
    formRef.current.setFieldsValue({code: node.code+'.'})
  }

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
      bordered: true
    },
    voPermission: "sys.staff.list",
  };

  const onClick = () => {
    console.log(table);
    table.current.refreshData(1);
  }
  const tProps = {
    treeData,
    value: treeValue,
    onSelect: onTreeSelect,
    placeholder: 'Please select',
    style: {
      width: '100%',
    },
  };
  return (
    <>
      <VoTable {...tableConfig} ref={table} />
      <Modal title="添加权限" visible={isModalVisible} >
        <Form ref ={formRef}>
          <Form.Item label="父权限" name="parent">
            <TreeSelect {...tProps} />
          </Form.Item>
          <Form.Item label="权限名称" name="name">
            <Input />
          </Form.Item>
          <Form.Item label="权限点" name="code">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default tableList;
