import VoTable from '@/pages/components/VoTable';
import GetParentTreeSelect from '@/pages/components/GetParentTreeSelect';
import SearchSelect from '@/pages/components/SearchSelect';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Select, message, Input, Button } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import styles from './index.less';
import { PageContainer } from '@ant-design/pro-layout';

const RoleList = (props) => {
  const table = useRef();
  const formRef = useRef();
  const treeSelectRef = useRef();
  const [treeList, setTreeList] = useState([]);
  const [staffData, setStaffData] = useState([]);
  const [adjustModal, setAdjustModal] = useState({});
  const searchs = [
    {
      title: '系统',
      dataIndex: '',
      key: 'key',
      type: 'input',
      colSpan: 1,
      defaultValue: "",
      placeholder: "",
      dataSource: [],
    },
  ];
  const columns = [
    {
      title: '配置',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '应用系统',
      dataIndex: 'data',
      key: 'version',
      render:(tag)=>{
        let data = Object.keys(tag);
        return data;
      }
    },
    {
      title: '系统版本',
      dataIndex: 'data',
      key: 'version',
      render:(tag)=>{
        let data = Object.keys(tag);

        return tag[data].version;
      }
    },
    {
      title: '系统地址',
      dataIndex: 'data',
      key: 'version',
      render:(tag)=>{
        let data = Object.keys(tag);

        return tag[data].url;
      }
    },
  ];
  const paging = {
    pageSize: 10,
    current: 1,
    total: 0,
    pageSizeOptions: [10, 20, 50, 100]
  };
  const toolBar = [
    {
      title: '添加角色',
      type: 'primary',
      key: 'add',
      icon: <PlusOutlined />,
      onClick: async () => {
        await setAdjustModal({ title: '添加角色', disabled: false, isModalVisible: true })
        await setStaffData([]);
        formRef.current.resetFields();
      },
    }
  ];
  const opCols = [
    {
      key: 'edit',
      title: "修改",
      type: "link",
      icon: <EditOutlined />,
      onClick: async (record) => {
        console.log(record);
        await setAdjustModal({ title: '修改角色', disabled: true, isModalVisible: true });
        let permissions = Tools.getTreeChild(record.permissionCodes, record.permissions)
        if (record.permissions.length) {
          treeSelectRef.current.state.value = permissions
        }
        let staffOptions = [];
        if (record.staffIds.length) {
          record.staffIds.forEach((v, i) => {
            staffOptions.push({ label: record.staffNames[i], value: v })
          })
        }
        await setStaffData(staffOptions);
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
        Tools.callAPI('sys.sys_config:delete', { configId: record.id }, (result) => {
          if (result.success) {
            message.success('删除成功');
            table.current.state.selectedRowKeys = []
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
  const tableConfig = {
    columns,
    paging,
    searchs,
    opCols,
    toolBar,
    dataSource: 'sys.sys_config:search',
    otherConfig: {
      rowKey: "id",
      bordered: true,
    },
    // rowSelectType: 'checkbox',
    voPermission: "sys.staff.role",
  };
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };
  const onSaveRole = () => {
    let addOptions = 'sys.role:save'
    let addStaffData = formRef.current.getFieldValue();
    if (!addStaffData.staffIds) {
      addStaffData.staffIds = [];
    }
    Tools.verify('sys.vf_role', addStaffData, (result, err) => {
      if (!result) {
        Tools.showMessage('保存失败', err);
        return;
      }
      Tools.callAPI(addOptions, { roleInfo: addStaffData }, (result) => {
        if (result.success) {
          message.success('保存成功');
          setAdjustModal({ isModalVisible: false })
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
    setAdjustModal({ isModalVisible: false })
  }
  useEffect(() => {
    Tools.callAPI('sys.permission:search', { conditions: {}, page: 1, size: 10000 }, (result) => {
      if (result.success) {
        setTreeList(result.data.rows)
      }
    });
  }, []);
  return (
    <>
      <PageContainer
        header={{
          title: '系统配置',
          breadcrumb: {
            routes: [{ breadcrumbName: '系统管理' }, { breadcrumbName: '当前页面' }]
          }
        }}
      >
        <VoTable {...tableConfig} ref={table} />
        <Modal title={adjustModal.title} footer={null} visible={adjustModal.isModalVisible} onCancel={closeModal}>
          <Form
            ref={formRef}
            {...formItemLayout}
            onFinish={onSaveRole} >
            <Form.Item label="角色名称" name="name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="描述" name="desc" rules={[{ required: true }]} >
              <Input />
            </Form.Item>
            <Form.Item label="权限" name="permissions" rules={[{ required: true }]} >
              <GetParentTreeSelect treeList={treeList} ref={treeSelectRef} />
            </Form.Item>
            <Form.Item label="员工" name="staffIds">
              <SearchSelect onChange={(val) => {}}  options={staffData} />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" >提交</Button>
              <Button type="primary" className={styles.btnCancel} onClick={closeModal}>取消</Button>
            </Form.Item>
          </Form>
        </Modal>
      </PageContainer>
    </>
  );
};

export default RoleList;
