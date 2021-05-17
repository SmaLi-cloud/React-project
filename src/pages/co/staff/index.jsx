import VoTable from '@/pages/components/VoTable';
import GetParentTreeSelect from '@/pages/components/GetParentTreeSelect';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Select, message, Input, TreeSelect, Button } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';


const staffList = () => {

    const table = useRef();
    const formRef = useRef();
    const [treeList, setTreeList] = useState([]);
    const [adjustModal, setAdjustModal] = useState({});

    const searchs = [
        {
            title: '员工姓名',
            dataIndex: '',
            key: 'trueName',
            type: 'input',
            colSpan: 1,
            defaultValue: "",
            placeholder: "",
            dataSource: [],
        },
        {
            title: '电话',
            dataIndex: '',
            key: 'phone',
            type: 'input',
            colSpan: 1,
            defaultValue: "",
            placeholder: "",
            dataSource: [],
        },
    ];
    const columns = [
        {
            title: '员工姓名',
            dataIndex: 'trueName',
            key: 'trueName',
        },
        {
            title: '电话',
            dataIndex: 'phone',
            key: 'phone',
        },
        {
            title: '登录次数',
            dataIndex: 'loginCount',
            key: 'loginCount',
        },
        {
            title: '最近登陆时间',
            dataIndex: 'lastLoginTime',
            sorter: true,
            key: 'lastLoginTime',
        },
    ];
    const paging = {
        pageSize: 20,
        current: 1,
        total: 0,
        pageSizeOptions: [10, 20, 50, 100]
    };
    const toolBar = [
        {
            title: '添加员工',
            type: 'primary',
            key: 'add',
            icon: <PlusOutlined />,
            onClick: async () => {
                await setAdjustModal({ title: '添加员工', disabled: false, isModalVisible: true })
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
            onClick: (record) => {
            },
            width: 100
        },
        {
            key: 'delete',
            title: "删除",
            type: "link",
            icon: <DeleteOutlined />,
            onClick: function (record) {
                Tools.callAPI('co.staff:delete', { staffId: record.id }, (result) => {
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
        dataSource: 'co.staff:search',
        otherConfig: {
            rowKey: "id",
            bordered: true,
        },
        rowSelectType: 'checkbox',
        voPermission: "co.staff",
    };
    const formItemLayout = {
        labelCol: {
            span: 6,
        },
        wrapperCol: {
            span: 14,
        },
    };

    const closeModal = () => {
        formRef.current.resetFields();
        setAdjustModal({ isModalVisible: false })
    }
    const onAddStaff = () => {
        let addOptions = 'co.staff:save'
        let addStaffData = formRef.current.getFieldValue();
        Tools.verify('co.vf_staff', addStaffData, (result, err) => {
            if (!result) {
                Tools.showMessage('保存失败', err);
                return;
            }
            Tools.callAPI(addOptions, { staffInfo: addStaffData }, (result) => {
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
    useEffect(() => {
        Tools.callAPI('sys.permission:search', { conditions: {}, page: 1, size: 10000 }, (result) => {
          if (result.success) {
            // let treeList = Tools.buildTree(result.data.rows, 'id', 'parentId', 'children', "")
            setTreeList(result.data.rows)
          }
        });
      }, []);
    return (
        <>
            <PageContainer
                header={{
                    title: '员工管理',
                    breadcrumb: {
                        routes: [{ breadcrumbName: '公司管理' }, { breadcrumbName: '当前页面' }]
                    }
                }}
            >
                <VoTable {...tableConfig} ref={table} />
                <Modal title={adjustModal.title} footer={null} visible={adjustModal.isModalVisible} onCancel={closeModal}>
                    <Form
                        ref={formRef}
                        {...formItemLayout}
                        onFinish={onAddStaff} >
                        <Form.Item label="员工姓名" name="trueName" rules={[{ required: true }]}>
                            {/* <TreeSelect {...tProps} disabled={adjustModal.disabled} /> */}
                            <Input />
                        </Form.Item>
                        <Form.Item label="登录名" name="loginName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="密码" name="password" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="权限" name="permissions" rules={[{ required: true }]}>
                        <GetParentTreeSelect treeList={treeList} onChange={(val)=>{}}/>
                        </Form.Item>
                        <Form.Item label="电话" name="phone" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="状态" name="status" rules={[{ required: true }]}>
                            <Select>
                                <Option value="0">离职</Option>
                                <Option value="1">在职</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="账号" name="enable" rules={[{ required: true }]}>
                        <Select>
                                <Option value="0">账号禁用</Option>
                                <Option value="1">账号启用</Option>
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

export default staffList;
