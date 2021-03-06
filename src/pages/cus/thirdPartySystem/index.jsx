import VoTable from '@/components/Vo/VoTable';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Select, message, Input, Button, Tooltip } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, InfoCircleOutlined, RedoOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import styles from './index.less';
import { PageContainer } from '@ant-design/pro-layout';
const thirdPartySystemList = () => {
  const table = useRef();
  const formRef = useRef();
  const [adjustModal, setAdjustModal] = useState({});
  
  const searchs = [
    {
      title: '名称',
      key: 'fullName',
      type: 'input',
      colSpan: 1,
    },
    {
      title: '系统类型',
      key: 'systemType',
      type: 'select',
      colSpan: 1,
      dataSource: [{ label: "内部", value: "internal" }, { label: "外部", value: "external" }],
    },
    {
      title: '是否启用',
      key: 'canUse',
      type: 'select',
      colSpan: 1,
      dataSource: [{ label: "是", value: "1" }, { label: "否", value: "0" }],
    },
  ];
  const columns = [
    {
      title: '名称',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: '系统类型',
      dataIndex: 'systemType',
      key: 'systemType',
      render: (data) => {
        if (data == 'external') {
          return '外部'
        }
        if (data == 'internal') {
          return '内部'
        }
      }
    },
    {
      title: '是否启用',
      dataIndex: 'canUse',
      key: 'canUse',
      render: (record) => {
        return record ? "是" : "否";

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
      title: '添加第三方系统',
      type: 'primary',
      key: 'add',
      icon: <PlusOutlined />,
      onClick: async () => {
        await setAdjustModal({ title: '添加第三方系统', disabled: false, isModalVisible: true });
        let guid = Tools.getGuid();
        let record = { secret: guid }
        formRef.current.setFieldsValue({ ...record })
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
        await setAdjustModal({ title: '修改第三方系统', disabled: true, isModalVisible: true });
        formRef.current.setFieldsValue({ ...record })
      },
      width: 100
    },
  ]
  const tableConfig = {
    columns,
    paging,
    searchs,
    opCols,
    toolBar,
    dataSource: 'cus.third_party_system:search',
    otherConfig: {
      rowKey: "id",
      bordered: true,
    },
    voPermission: "cus.third_party_system.list",
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
    let addOptions = 'cus.third_party_system:save'
    let addThirdPartySystemData = formRef.current.getFieldValue();
    Tools.verify('cus.vf_third_party_system', addThirdPartySystemData, (result, err) => {
      if (!result) {
        Tools.showMessage('保存失败', err, 'error');
        return;
      }
      Tools.callAPI(addOptions, { thirdPartySystemInfo: addThirdPartySystemData }, (result) => {
        if (result.success) {
          message.success('保存成功');
          setAdjustModal({ isModalVisible: false })
          table.current.refreshData()
        } else if (!result.success) {
          Tools.showMessage('保存失败', result.msg, 'error');
        }
      }, (result) => {
        Tools.logMsg(result);
      })
    })
  }
  const closeModal = () => {
    formRef.current.resetFields();
    setAdjustModal({ isModalVisible: false })
  }
  const refreshSecret = () => {
    let sysConfigData = formRef.current.getFieldValue();
    sysConfigData.secret = Tools.getGuid();
    formRef.current.resetFields(); //touch render
    formRef.current.setFieldsValue({ ...sysConfigData })
  }
  return (
    <>
      <PageContainer
        header={{
          title: '第三方系统管理',
          breadcrumb: {
            routes: [{ breadcrumbName: '客户管理' }, { breadcrumbName: '当前页面' }]
          }
        }}
      >
        <VoTable {...tableConfig} ref={table} />
        <Modal title={adjustModal.title} footer={null} visible={adjustModal.isModalVisible} onCancel={closeModal}>
          <Form
            ref={formRef}
            {...formItemLayout}
            onFinish={onSaveThirdPartySystem} >
            <Form.Item label="系统名称" name="fullName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="系统类型" name="systemType" rules={[{ required: true }]}>
              <Select>
                <Select.Option value='external'>外部</Select.Option>
                <Select.Option value='internal'>内部</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item label="密钥" name="secret" rules={[{ required: true }]}>
              <Input
                suffix={
                  <Tooltip title="更新密钥">
                    <RedoOutlined style={{ color: '#fa7e23' }} onClick={() => { refreshSecret() }} />
                  </Tooltip>
                } />
            </Form.Item>
            <Form.Item label="是否启用" name="canUse" rules={[{ required: true }]}>
              <Select>
                <Select.Option value={1}>是</Select.Option>
                <Select.Option value={0}>否</Select.Option>
              </Select>
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

export default thirdPartySystemList;
