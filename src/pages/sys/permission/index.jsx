import VoTable from '@/pages/components/VoTable';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, TreeSelect, Input, Button, message, notification } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';


const tableList = () => {
  const formRef = useRef();
  const table = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [treeValue, setTreeValue] = useState("");
  const [treeData, setTreeData] = useState([]);
  const [adjustModal, setAdjustModal] = useState({});

  useEffect(() => {
    Tools.callAPI('sys.permission:search', { conditions: {}, page: 1, size: 10000 }, (result) => {
      if (result.success) {
        let treeData = Tools.buildTree(result.data.rows, 'id', 'parentId', 'children', "")
        setTreeData(treeData)
      }
    });
  }, []);

  const opCols = [
    {
      key: 'edit',
      title: "修改",
      type: "link",
      icon: <EditOutlined />,
      onClick: async function (record, dataSource) {
        setAdjustModal({ title: '修改权限', disabled: true })
        let treeData = Tools.buildTree(dataSource, 'id', 'parentId', 'children', "")
        setTreeData(treeData)
        await setIsModalVisible(true)
        formRef.current.setFieldsValue({ ...record })
      },
      width: 100
    },
    {
      key: 'delete',
      title: "删除",
      type: "link",
      icon: <DeleteOutlined />,
      onClick: function (record) {
        let deleteOptions = 'sys.permission:delete'
        let deleteData = {};
        deleteData.permissionId = record.id;
        Tools.callAPI(deleteOptions, deleteData, (result) => {
          if (result.success && result.data) {
            message.success('删除成功');
            table.current.refreshData()
          } else if (!result.success) {
            Tools.showMessage('删除失败', result.msg);
            return;
          }
        }, (result) => {
          console.log(result);
        })
      },
      width: 100
    }
  ]
  const columns = [
    {
      title: '名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '权限编码',
      dataIndex: 'code',
      sorter: true,
      key: 'code',
    },
    {
      title: '层级',
      dataIndex: 'level',
      key: 'level',
    },
    {
      title: '排序',
      dataIndex: 'orderNo',
      sorter: true,
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
      title: '名称',
      dataIndex: '',
      key: 'name',
      type: 'input',
      colSpan: 1,
      defaultValue: "",
      placeholder: "",
      dataSource: [],//string，[]
      //取数据的方式
    }, {
      title: '父权限',
      dataIndex: '',
      key: 'parentId',
      type: 'treeSelect',
      colSpan: 1,
      dataSource: treeData
    }, {
      title: '权限编码',
      dataIndex: '',
      key: 'code',
      type: 'input',
      colSpan: 1,
    },
    {
      title: '层级',
      dataIndex: '',
      key: 'level',
      type: 'input',
      colSpan: 1,
    },

  ];
  const toolBar = [
    {
      title: '添加权限',
      type: 'primary',
      key: 'add',
      icon: <PlusOutlined />,
      onClick: async (dataSource) => {
        setAdjustModal({ title: '添加权限', disabled: false })
        let treeData = Tools.buildTree(dataSource, 'id', 'parentId', 'children', "")
        setTreeData(treeData)
        await setIsModalVisible(true)
        formRef.current.resetFields();

      },
    }];

  const onTreeSelect = (_, node) => {
    formRef.current.setFieldsValue({ code: node.code + '.' })
  }
  // const onSelectChange = (selectedRowKeys) => {
  //   Tools.logMsg(selectedRowKeys);
  // }
  const onAddPermission = () => {
    let addOptions = 'sys.permission:save'
    let permissionData = formRef.current.getFieldValue();
    Tools.verify('sys.vf_permission', permissionData, (result, err) => {
      if (!result) {
        Tools.showMessage('保存失败', err);
        return;
      }
      Tools.callAPI(addOptions, { permissionInfo: permissionData }, (result) => {
        if (result.success) {
          message.success('保存成功');
          setIsModalVisible(false)
          table.current.refreshData()
        } else if (!result.success) {
          Tools.showMessage('保存失败', result.msg);
        }
      }, (result) => {
        console.log(result);
      })
    })

  }
  const closeModal = () => {
    formRef.current.resetFields();
    setIsModalVisible(false)
  }
  const numberOnly = (e) => {
    const { value } = e.target;
    const reg = /^-?\d*(\.\d*)?$/;
    if ((!isNaN(value) && reg.test(value)) || value === '' || value === '-') {
      formRef.current.setFieldsValue({ orderNo: value })
    } else {
      let numberValue = value.substr(0, value.length - 1);
      formRef.current.setFieldsValue({ orderNo: numberValue })
    }
  }
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };
  const tableConfig = {
    searchs,
    columns,
    opCols,
    toolBar,
    paging,
    dataSource: 'sys.permission:search',
    otherConfig: {
      rowKey: "id",
      // rowSelection: {
      //   type: 'checkbox',
      //   onChange: onSelectChange
      // },
      bordered: true,
    },
    voPermission: "sys.staff.list",
  };


  const tProps = {
    treeData,
    value: treeValue,
    onSelect: onTreeSelect,
    placeholder: '请选择父权限',
    style: {
      width: '100%',
    },
  };
  return (

    <PageContainer
      header={{
        title: '权限管理',
        breadcrumb: {
          routes: [{ breadcrumbName: '系统管理' }, { breadcrumbName: '当前页面' }]
        }
      }}
    >
      <VoTable {...tableConfig} ref={table} />
      <Modal title={adjustModal.title} footer={null} visible={isModalVisible} onCancel={closeModal}>
        <Form
          ref={formRef}
          {...formItemLayout}
          onFinish={onAddPermission} >
          <Form.Item label="父权限" name="parentId">
            <TreeSelect {...tProps} disabled={adjustModal.disabled} />
          </Form.Item>
          <Form.Item label="权限名称" name="name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="权限编码" name="code" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="排序" name="orderNo" onChange={numberOnly} rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
            <Button type="primary" htmlType="submit" >提交</Button>
            <Button type="primary" className={styles.btnCancel} onClick={closeModal}>取消</Button>
          </Form.Item>
        </Form>
      </Modal>

    </PageContainer>

  );
};

export default tableList;
