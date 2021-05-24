import VoTable from '@/pages/components/VoTable';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Select, message, Input, Button, Tooltip } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, InfoCircleOutlined, RedoOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import styles from './index.less';
import { PageContainer } from '@ant-design/pro-layout';

const dictionaryList = () => {

  const table = useRef();
  const formRef = useRef();
  const [adjustModal, setAdjustModal] = useState({});

  const searchs = [
    {
      title: '服务名称',
      dataIndex: '',
      key: 'serverName',
      type: 'input',
      colSpan: 1,
      defaultValue: "",
      placeholder: "",
      dataSource: [],
    },
    {
      title: '路径',
      dataIndex: '',
      key: 'path',
      type: 'input',
      colSpan: 1,
      defaultValue: "",
      placeholder: "",
      dataSource: [],
    },
    {
      title: '是否启用',
      dataIndex: '',
      key: 'status',
      type: 'select',
      colSpan: 1,
      defaultValue: "",
      placeholder: "",
      dataSource: [{ label: "", value: '' }, { label: "启用", value: "1" }, { label: "禁用", value: "0" }],
    },
  ];
  const columns = [
    {
      title: '服务名称',
      dataIndex: 'serverName',
      key: 'serverName',
    },
    {
      title: '路径',
      dataIndex: 'path',
      key: 'path',
    },
    {
      title: '负载比',
      dataIndex: 'loadRatio',
      key: 'loadRatio',
    },
    {
      title: '地址',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: '是否启用',
      dataIndex: 'status',
      key: 'status',
      render: (record) => {
        return record ? "启用" : "禁用";
      }
    },
    {
      title: '主机',
      dataIndex: 'host',
      key: 'host',
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
      title: '添加API服务',
      type: 'primary',
      key: 'add',
      icon: <PlusOutlined />,
      onClick: async () => {
        await setAdjustModal({ title: '添加API服务', disabled: false, isModalVisible: true });
        formRef.current.resetFields();
      },
    }
  ];
  const opCols = [
    {
      key: 'Edit',
      title: "修改",
      type: "link",
      icon: <EditOutlined />,
      onClick: async (record) => {
        await setAdjustModal({ title: '修改API服务', disabled: true, isModalVisible: true });
        Tools.logMsg(record)
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
        let deleteOptions = 'sys.api_server_list:delete'
        let deletApiServerListData = {};
        deletApiServerListData.apiServerListId = record.id;
        Tools.callAPI(deleteOptions, deletApiServerListData, (result) => {
          Tools.logMsg(result)
          if (result.success) {
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
  const tableConfig = {
    columns,
    paging,
    searchs,
    opCols,
    toolBar,
    dataSource: 'sys.api_server_list:search',
    otherConfig: {
      rowKey: "id",
      bordered: true,
    },
    voPermission: "sys.api_server_list",
  };
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };
  const onSaveThirdPartySystem = () => {
    let addOptions = 'sys.api_server_list:save'
    let addApiServerListData = formRef.current.getFieldValue();
    Tools.logMsg(addApiServerListData)
    Tools.verify('sys.vf_api_server_list', addApiServerListData, (result, err) => {
      if (!result) {
        Tools.showMessage('保存失败', err);
        return;
      }
      Tools.callAPI(addOptions, { apiServerListInfo: addApiServerListData }, (result) => {
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

  return (
    <>
      <PageContainer
        header={{
          title: 'API服务',
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
            onFinish={onSaveThirdPartySystem} >
            <Form.Item label="服务器名称" name="serverName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="路径" name="path" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="负载比率" name="loadRatio" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="地址" name="address" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="是否启用" name="status" rules={[{ required: true }]}>
              <Select>
                <Select.Option value={1}>启用</Select.Option>
                <Select.Option value={0}>禁用</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="主机" name="host" >
              <Input />
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

export default dictionaryList;
