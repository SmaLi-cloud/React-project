import VoTable from '@/components/Vo/VoTable';
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
      title: '模组名称',
      key: 'modelName',
      type: 'input',
      colSpan: 1,
    },
    {
      title: '主控型号',
      key: 'mainControlType',
      type: 'input',
      colSpan: 1,
    },
    {
      title: '存储大小',
      key: 'storageSize',
      type: 'input',
      colSpan: 1,
    },
  ];
  const columns = [
    {
      title: '模组名称',
      dataIndex: 'modelName',
      key: 'modelName',
    },
    {
      title: '主控型号',
      dataIndex: 'mainControlType',
      key: 'mainControlType',
    },
    {
      title: '存储大小',
      dataIndex: 'storageSize',
      key: 'storageSize',
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
      title: '添加模组',
      type: 'primary',
      key: 'add',
      icon: <PlusOutlined />,
      onClick: async () => {
        await setAdjustModal({ title: '添加模组', disabled: false, isModalVisible: true });
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
        await setAdjustModal({ title: '修改模组', disabled: true, isModalVisible: true });
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
    dataSource: 'sys.model:search',
    otherConfig: {
      rowKey: "id",
      bordered: true,
    },
    voPermission: "sys.model",
  };
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };
  const onSaveModel = () => {
    let addOptions = 'sys.model:save'
    let addModelData = formRef.current.getFieldValue();
    Tools.verify('sys.vf_model', addModelData, (result, err) => {
      if (!result) {
        Tools.showMessage('保存失败', err, 'error');
        return;
      }
      Tools.callAPI(addOptions, { modelInfo: addModelData }, (result) => {
        if (result.success) {
          message.success('保存成功');
          setAdjustModal({ isModalVisible: false })
          table.current.refreshData()
        } else if (!result.success) {
          Tools.showMessage('保存失败', result.msg, 'error');
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
          title: '模组管理',
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
            onFinish={onSaveModel} >
            <Form.Item label="模组名称" name="modelName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="主控型号" name="mainControlType" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="存储大小" name="storageSize" rules={[{ required: true }]}>
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
