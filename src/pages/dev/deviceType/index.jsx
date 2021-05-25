import VoTable from '@/components/Vo/VoTable';
import React, { useState, useRef } from 'react';
import { Modal, Form, message, Input, Button } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import styles from './index.less';
import { PageContainer } from '@ant-design/pro-layout';

const deviceTypeList = () => {
  const table = useRef();
  const formRef = useRef();
  const [adjustModal, setAdjustModal] = useState({});
  const searchs = [
    {
      title: '设备产品类型',
      key: 'typeName',
      type: 'input',
      colSpan: 1,
    },
  ];
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'typeName',
      key: 'typeName',
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
      title: '添加设备类型',
      type: 'primary',
      key: 'add',
      icon: <PlusOutlined />,
      onClick: async () => {
        await setAdjustModal({ title: '添加设备类型', disabled: false, isModalVisible: true })
        formRef.current.resetFields();
      }
    }
  ];
  const opCols = [
    {
      key: 'Edit',
      title: "修改",
      type: "link",
      icon: <EditOutlined />,
      onClick: async (record) => {
        await setAdjustModal({ title: '修改设备类型', disabled: false, isModalVisible: true })
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
        let deleteOptions = 'sys.device_type:delete'
        let delDeviceTypeData = {};
        delDeviceTypeData.deviceTypeId = record.id;
        Tools.callAPI(deleteOptions, delDeviceTypeData, (result) => {
          Tools.logMsg(result)
          if (result.success) {
            message.success('删除成功');
            table.current.refreshData()
          } else if (!result.success) {
            Tools.showMessage('删除失败', result.msg, 'error');
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
    dataSource: 'sys.device_type:search',
    otherConfig: {
      rowKey: "id",
      bordered: true,
    },
    voPermission: "sys.device_type",
  };
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };
  const onSaveDeviceType = () => {
    let addOptions = 'sys.device_type:save'
    let addDeviceTypeData = formRef.current.getFieldValue();
    Tools.verify('sys.vf_device_type', addDeviceTypeData, (result, err) => {
      if (!result) {
        Tools.showMessage('保存失败', err, 'error');
        return;
      }
      Tools.callAPI(addOptions, { deviceTypeInfo: addDeviceTypeData }, (result) => {
        if (result.success) {
          message.success('保存成功');
          closeModal();
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
          title: '设备类型管理',
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
            onFinish={onSaveDeviceType} >
            <Form.Item label="设备类型名称" name="typeName" rules={[{ required: true }]}>
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

export default deviceTypeList;
