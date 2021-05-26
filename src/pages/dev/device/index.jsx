import VoTable from '@/components/Vo/VoTable';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Select, message, Input, Button } from 'antd';
import { EditOutlined, PlusOutlined, EyeOutlined, UploadOutlined, FileExcelOutlined, RotateRightOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import styles from './index.less';
import { PageContainer } from '@ant-design/pro-layout';
import config from '@/utils/config.js';
const deviceList = () => {
  const table = useRef();
  const formRef = useRef();
  const [adjustModal, setAdjustModal] = useState({ isModalVisible: false, nameType: {} });
  const [thirdPartySystemOptions, setThirdPartySystemOptions] = useState([]);
  const [deviceTypeOptions, setDeviceTypeOptions] = useState([]);
  const [modelOptions, setModelOptions] = useState([]);
  const searchs = [
    {
      title: '设备名称',
      key: 'deviceName',
      type: 'input',
      colSpan: 1,
    },
    {
      title: '设备编码',
      key: 'deviceId',
      type: 'input',
      colSpan: 1,
    },
    {
      title: '设备产品类型',
      key: 'deviceType',
      type: 'select',
      colSpan: 1,
      dataSource: deviceTypeOptions,
    },
    {
      title: '用户名',
      key: 'username',
      type: 'input',
      colSpan: 1,
    },
    {
      title: '第三方管理',
      key: 'thirdPartySystemId',
      type: 'select',
      colSpan: 1,
      dataSource: thirdPartySystemOptions,
    },
    {
      title: '模组名称',
      key: 'modelId',
      type: 'select',
      colSpan: 1,
      dataSource: modelOptions,
    },
    {
      title: '添加时间',
      key: 'addTime',
      type: 'DatePicker',
      colSpan: 2,
    },
    {
      title: '激活时间',
      key: 'activationTime',
      type: 'DatePicker',
      colSpan: 2,
    }
  ];
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '模组名称',
      dataIndex: 'modelName',
      key: 'modelName',
    },
    {
      title: '设备编码',
      dataIndex: 'deviceId',
      key: 'deviceId',
    },
    {
      title: '设备产品类型名',
      dataIndex: 'deviceTypeName',
      key: 'deviceTypeName',
    },
    {
      title: '第三方管理名称',
      dataIndex: 'thirdPartySystemName',
      key: 'thirdPartySystemName',
    },
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '添加时间',
      dataIndex: 'addTime',
      key: 'addTime',
      sorter: true
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
      title: '单次添加设备',
      type: 'primary',
      key: 'add',
      icon: <PlusOutlined />,
      onClick: async () => {
        await setAdjustModal(
          {
            title: '添加设备',
            disabled: false,
            isModalVisible: true,
            multiple: false,
            nameType: { deviceId: 'deviceId', username: 'username', password: 'password' },
          });
        let guid = Tools.getGuid();
        let record = { secret: guid }
        formRef.current.setFieldsValue({ ...record })
      },
    },
    {
      title: '批量添加设备',
      type: 'primary',
      key: 'addBatch',
      icon: <PlusOutlined />,
      onClick: async () => {
        await setAdjustModal({
          title: '批量设备',
          disabled: false,
          isModalVisible: true,
          multiple: true,
          nameType: { deviceId: 'deviceIdPrefix', username: 'usernamePrefix', password: 'passwordPrefix', }
        });
        let guid = Tools.getGuid();
        let record = { secret: guid }
        formRef.current.setFieldsValue({ ...record })
      },
    },
    {
      title: '一键导出',
      type: 'primary',
      key: 'excelExport',
      icon: <FileExcelOutlined />,
      onClick: async () => {
        let { conditions } = table.current.getSearchConditions();
        Tools.logMsg(conditions)
        Tools.callAPI('dev.device:excel_export', { conditions }, (result) => {
          Tools.logMsg(result)
          if (result.success) {
            let url = config.prefix + result.data.exportXls;
            Tools.showMessage('导出文件成功', ['共导出' + result.data.eportCount + '条数据', '点击 知道了 下载Excel文件'], 'success',function () {
            location.href = url;
            });
          } else {
            Tools.showMessage('导出文件失败',result.msg,'error')
          }
        })
      },
    },
    {
      title: '上传文件',
      type: '',
      key: 'upload',
      icon: <UploadOutlined />,
      uploadAction: 'dev.device:excel_import',
      allowFile: ['xls', 'xlsx'],
      successCallback: (result) => {
        if (!result.success) {
          showMessage('上传失败', result.msg, 'error');
        } else if (result.success && result.data.importResult) {
          message.success('上传文件内容添加成功');
        } else {
          let url = config.prefix + result.data.errorXls;
          showMessage('上传失败', '点击确定,下载错误文件', 'error', function () {
            location.href = url;
          });
        }
      },
    },

  ];
  const opCols = [
    {
      key: 'statusUnfold',
      title: "状态信息",
      type: "link",
      icon: <EyeOutlined />,
      onClick: (record) => {
        let statusInfo = record.statusInfo;
        if (typeof record.content !== 'string') {
          statusInfo = JSON.stringify(statusInfo)
        }
        Modal.info({
          title: '状态信息详情',
          width: 1250,
          height: 600,
          content: (
            <div>
              {/* highLight插件 */}
              <Input.TextArea value={statusInfo} autoSize={{ minRows: 5, maxRows: 10 }} />
            </div>
          ),
        });
      },
      width: 110
    },
    {
      key: 'Edit',
      title: "修改",
      type: "link",
      icon: <EditOutlined />,
      onClick: async (record) => {
        await setAdjustModal({
          title: '修改设备',
          disabled: true,
          isModalVisible: true,
          multiple: false,
          nameType: { deviceId: 'deviceId', username: 'username', password: 'password', }
        });
        formRef.current.setFieldsValue({ ...record })
      },
      width: 100
    },
    {
      key: 'log',
      title: "日志",
      type: "link",
      icon: <RotateRightOutlined />,
      onClick: async (record) => {
       Tools.logMsg(record)
       location.href = '/log/deviceLog?deviceId='+record.deviceId
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
    dataSource: 'dev.device:search',
    otherConfig: {
      rowKey: "id",
      bordered: true,
    },
    voPermission: "dev.device.list",
  };
  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };
  const onSaveDevice = () => {
    let addOptions = adjustModal.multiple ? 'dev.device:save_batch' : 'dev.device:save'
    let verify = adjustModal.multiple ? 'dev.vf_device_batch' : 'dev.vf_device'
    let addDeviceData = formRef.current.getFieldValue();
    Tools.verify(verify, addDeviceData, (result, err) => {
      if (!result) {
        Tools.showMessage('保存失败', err, 'error');
        return;
      }
      Tools.callAPI(addOptions, { deviceInfo: addDeviceData }, (result) => {
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
    setAdjustModal({ isModalVisible: false, nameType: {} })
  }
  useEffect(() => {
    Tools.callAPI('cus.third_party_system:search', { conditions: {}, page: 1, size: 10000 }, (result) => {
      if (result.success) {
        let options = result.data.rows.map((v, i) => {
          return { label: v.fullName, value: v.id }
        })
        setThirdPartySystemOptions(options)
      }
    });
    Tools.callAPI('dev.model:search', { conditions: {}, page: 1, size: 10000 }, (result) => {
      if (result.success) {
        let options = result.data.rows.map((v, i) => {
          return { label: v.modelName, value: v.id }
        })
        setModelOptions(options)
      }
    });
    Tools.callAPI('dev.device_type:search', { conditions: {}, page: 1, size: 10000 }, (result) => {
      if (result.success) {
        let options = result.data.rows.map((v, i) => {
          return { label: v.typeName, value: v.id }
        })
        setDeviceTypeOptions(options)
      }
    });
  }, []);
  return (
    <>
      <PageContainer
        header={{
          title: '设备管理',
          breadcrumb: {
            routes: [{ breadcrumbName: '硬件管理' }, { breadcrumbName: '当前页面' }]
          }
        }}
      >
        <VoTable {...tableConfig} ref={table} />
        <Modal title={adjustModal.title} footer={null} visible={adjustModal.isModalVisible} onCancel={closeModal}>
          <Form
            ref={formRef}
            {...formItemLayout}
            onFinish={onSaveDevice} >
            <Form.Item label="设备名称" name="deviceName">
              <Input />
            </Form.Item>
            <Form.Item label={adjustModal.multiple ? "设备编码前缀" : "设备编码"} name={adjustModal.nameType.deviceId} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label={adjustModal.multiple ? "用户名前缀" : "用户名"} name={adjustModal.nameType.username} rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            {
              adjustModal.disabled ?
                null : <Form.Item label={adjustModal.multiple ? "密码前缀" : "密码"} name={adjustModal.nameType.password} rules={[{ required: true }]}>
                  <Input />
                </Form.Item>
            }
            <Form.Item label="设备产品类型" name="deviceType" rules={[{ required: true }]}>
              <Select options={deviceTypeOptions} />
            </Form.Item>
            <Form.Item label="模组名称" name="modelId" rules={[{ required: true }]}>
              <Select options={modelOptions} />
            </Form.Item>
            <Form.Item label="第三方管理" name="thirdPartySystemId" rules={[{ required: true }]}>
              <Select options={thirdPartySystemOptions} />
            </Form.Item>
            {adjustModal.multiple ?
              <Form.Item label="个数" name="count" rules={[{ required: true }]}>
                <Input />
              </Form.Item> : null
            }
            {adjustModal.multiple ?
              <Form.Item label="起始值" name="start" rules={[{ required: true }]}>
                <Input />
              </Form.Item> : null
            }
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

export default deviceList;
