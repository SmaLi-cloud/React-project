import VoTable from '@/pages/components/VoTable';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Select, Input, Button, message } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';


const dictionaryList = () => {

  const table = useRef();
  const formRef = useRef();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [adjustModal, setAdjustModal] = useState({});
  const [typeList, setTypeList] = useState([]);
  const [selectOptions, setSelectOptions] = useState([]);


  const searchs = [
    {
      title: '字典值',
      dataIndex: '',
      key: 'itemName',
      type: 'input',
      colSpan: 1,
      defaultValue: "",
      placeholder: "",
      dataSource: [],
    },
    {
      title: '字典码',
      dataIndex: '',
      key: 'typeCode',
      type: 'input',
      colSpan: 1,
      defaultValue: "",
      placeholder: "",
      dataSource: [],
    },
  ];
  const columns = [
    {
      title: '类型',
      dataIndex: 'typeNames',
      key: 'itemName',
    },
    {
      title: '字典值',
      dataIndex: 'itemName',
      key: 'itemName',
    },
    {
      title: '字典码',
      dataIndex: 'typeCode',
      sorter: true,
      key: 'typeCode',
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
  const toolBar = [
    {
      title: '添加部门',
      type: 'primary',
      key: 'add',
      icon: <PlusOutlined />,
      onClick: async () => {
        setAdjustModal({ title: '添加', disabled: false })
        addSelectOptions();
        await setIsModalVisible(true);
        formRef.current.resetFields();
      }
    }, {
      title: '添加类型',
      type: 'primary',
      key: 'add',
      icon: <PlusOutlined />,
      onClick: async () => {
        setAdjustModal({ title: '添加', disabled: false })
        addSelectOptions();
        await setIsModalVisible(true);
        formRef.current.resetFields();
      }
    }
  ];
  const opCols = [
    {
      key: 'edit',
      title: "修改",
      type: "link",
      icon: <EditOutlined />,
      onClick: async (record) => {
        setAdjustModal({ title: '修改', disabled: false })
        await setIsModalVisible(true)
        addSelectOptions();
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
        let deleteOptions = 'sys.dictionary:delete'
        let deleteDictionaryData = {};
        deleteDictionaryData.dictionaryId = record.id;
        Tools.callAPI(deleteOptions, deleteDictionaryData, (result) => {
          debugger
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
    dataSource: 'sys.dictionary:search',
    otherConfig: {
      rowKey: "id",
      bordered: true,
      rowSelection: {
        type: 'checkbox',
        onChange: (selectedRowKeys) => {
          Tools.logMsg(selectedRowKeys)
          table.current.popupAlter(selectedRowKeys.length)
        }
      },
    },
    voPermission: "sys.staff.list",
  };
  useEffect(() => {

    Tools.callAPI('sys.dictionary:search', { conditions: {}, page: 1, size: 10000 }, (result) => {
      if (result.success) {
        Tools.logMsg("chenggng")
        Tools.logMsg(result)
        let typeList = [];
        let checkList = [];
        result.data.rows.forEach((v, i) => {
          if (!checkList.includes(v.typeNames)) {
            typeList.push(v.typeNames)
            checkList.push(v.typeNames)
        debugger

            
          }
        })
        setTypeList(typeList)
      }
    });
  }, []);
  const addSelectOptions = () => {
    let children = [];
    debugger
    if (!typeList.length) return;
    typeList.forEach((v, i) => {
      children.push(
        <Select.Option value={v.typeCode} key={i}>{v.title}</Select.Option>
      )
    })
    setSelectOptions(children);
  }
  const closeModal = () => {
    formRef.current.resetFields();
    setIsModalVisible(false)
  }
  const onSaveDictionary = () => {
    let addOptions = 'sys.dictionary:save'
    let dictionaryData = formRef.current.getFieldValue();
    console.log(formRef.current.getFieldValue())
    Tools.verify('sys.vf_dictionary', dictionaryData, (result, err) => {
      if (!result) {
        Tools.showMessage('保存失败', err);
        return;
      }
      Tools.callAPI(addOptions, { dictionaryInfo: dictionaryData }, (result) => {
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

  const formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };
  return (
    <>
      <PageContainer
        header={{
          title: '字典管理',
          breadcrumb: {
            routes: [{ breadcrumbName: '系统管理' }, { breadcrumbName: '当前页面' }]
          }
        }}
      >
        <VoTable {...tableConfig} ref={table} />
        <Modal title={adjustModal.title} footer={null} visible={isModalVisible} onCancel={closeModal}>
          <Form
            {...formItemLayout}
            ref={formRef}
            onFinish={onSaveDictionary}
          >
            <Form.Item label="字典码" name="typeCode" rules={[{ required: true }]}>
              <Select>{selectOptions}</Select>
            </Form.Item>
            <Form.Item label="字典值" name="itemName" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item label="排序" name="orderNo" rules={[{ required: true }]}>
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
