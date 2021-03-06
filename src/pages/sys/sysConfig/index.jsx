import VoTable from '@/components/Vo/VoTable';
import VoTreeSelect from '@/components/Vo/VoTreeSelect';
import SearchSelect from '@/components/Vo/VoSearchSelect';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Select, message, Input, Button } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import styles from './index.less';
import { PageContainer } from '@ant-design/pro-layout';
const { TextArea } = Input;

const sysConfigList = (props) => {
  const table = useRef();
  const formRef = useRef();
  const [adjustModal, setAdjustModal] = useState({});
  const searchs = [
    {
      title: '系统',
      key: 'key',
      type: 'input',
      colSpan: 1,
    },
  ];
  const columns = [
    {
      title: '配置名称',
      dataIndex: 'key',
      key: 'key',
    },
    {
      title: '配置信息',
      dataIndex: 'data',
      key: 'data'
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
      title: '添加系统',
      type: 'primary',
      key: 'add',
      icon: <PlusOutlined />,
      onClick: async () => {
        await setAdjustModal({ title: '添加系统', disabled: false, isModalVisible: true })
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
        await setAdjustModal({ title: '修改系统', disabled: true, isModalVisible: true });
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
            Tools.showMessage('删除失败', result.msg, 'error');
            return;
          }
        }, (result) => {
          Tools.logMsg(result);
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
    voPermission: "sys.sys_config.list",
  };
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };
  const onSaveSysConfig = () => {
    let addOptions = 'sys.sys_config:save'
    let addSysConfigData = formRef.current.getFieldValue();
    Tools.verify('sys.vf_sys_config', addSysConfigData, (result, err) => {
      if (!result) {
        Tools.showMessage('保存失败', err, 'error');
        return;
      }
      Tools.callAPI(addOptions, { configInfo: addSysConfigData }, (result) => {
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
  return (
    <>
      <PageContainer
        header={{
          title: '系统配置管理',
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
            onFinish={onSaveSysConfig} >
            <Form.Item label="配置名称" name="key" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="系统地址" name="data">
              <TextArea />
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

export default sysConfigList;
