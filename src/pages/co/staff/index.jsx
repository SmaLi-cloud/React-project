import VoTable from '@/components/Vo/VoTable';
import VoTreeSelect from '@/components/Vo/VoTreeSelect';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Select, message, Input, Button } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, SettingOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import { PageContainer } from '@ant-design/pro-layout';
import styles from './index.less';
const { Option } = Select;


const staffList = () => {

    const table = useRef();
    const formRef = useRef();
    const treeSelectRef = useRef();
    const [treeData, setTreeData] = useState([]);
    const [roleOption, setRoleOption] = useState([]);
    const [adjustModal, setAdjustModal] = useState({});

    const searchs = [
        {
            title: '员工姓名',
            key: 'trueName',
            type: 'input',
            colSpan: 1,
        },
        {
            title: '手机号码',
            key: 'phone',
            type: 'input',
            colSpan: 1,
        },
    ];
    const columns = [
        {
            title: '员工姓名',
            dataIndex: 'trueName',
            key: 'trueName',
            width: 150
        },
        {
            title: '手机号码',
            dataIndex: 'phone',
            key: 'phone',
            width: 120
        },
        {
            title: '登录次数',
            dataIndex: 'loginCount',
            key: 'loginCount',
            width: 120
        },
        {
            title: '最近登陆时间',
            dataIndex: 'lastLoginTime',
            sorter: true,
            key: 'lastLoginTime',
            width: 200

        },
        {
            title: '角色',
            dataIndex: 'roleNames',
            key: 'roleNames',
            render: (tag) => {
                let tagStr = Tools.cloneDeep(tag).toString()
                return (
                    <>{tagStr}</>
                )
            },
            width: 200
        },
        {
            title: '权限',
            dataIndex: 'permissionNames',
            key: 'permissionNames',
            render: (tag) => {
                let tagStr = Tools.cloneDeep(tag).toString()
                return (
                    <>{tagStr}</>
                )
            }
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
            onClick: async (record) => {
                Tools.logMsg(record)
                await setAdjustModal({ title: '修改员工信息', disabled: true, isModalVisible: true });
                formRef.current.setFieldsValue({ ...record })
            },
            width: 100
        },
        {
            key: 'delete',
            title: "删除",
            type: "link",
            needConfirm: true,
            confirmMsg: "确定要删除么？",
            icon: <DeleteOutlined />,
            onClick: function (record) {
                Tools.callAPI('co.staff:delete', { staffId: record.id }, (result) => {
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
                    Tools.showMessage('删除失败');
                })
            },
            width: 100
        },

        {
            key: 'reset_password',
            title: "重置密码",
            type: "link",
            tipMsg: "密码将会重置为手机号后6位",
            needConfirm: true,
            confirmMsg: "确定要重置么？",
            icon: <SettingOutlined />,
            onClick: function (record) {
                Tools.callAPI('co.staff:reset_password', { staffId: record.id }, (result) => {
                    if (result.success) {
                        message.success('密码重置成功');
                    } else if (!result.success) {
                        Tools.showMessage('密码重置失败', result.msg, 'error');
                    }
                }, (result) => {
                    Tools.logMsg(result)
                })
            },
            width: 110
        },
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
        voPermission: "co.staff.list",
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
    const onSaveStaff = () => {
        let addOptions = 'co.staff:save'
        let addStaffData = formRef.current.getFieldValue();
        Tools.verify('co.vf_staff', addStaffData, (result, err) => {
            if (!result) {
                Tools.showMessage('保存失败', err, 'error');
                return;
            }
            Tools.callAPI(addOptions, { staffInfo: addStaffData }, (result) => {
                if (result.success) {
                    message.success('保存成功');
                    setAdjustModal({ isModalVisible: false })
                    table.current.refreshData()
                } else if (!result.success) {
                    Tools.showMessage('保存失败', result.msg, 'error');
                }
            }, (result) => {
                Tools.logMsg(result)
            })
        })
    }
    useEffect(() => {
        Tools.callAPI('sys.chooser:get_all_permission', {}, (result) => {
            if (result.success) {
                setTreeData(result.data);
            }
        });

        Tools.callAPI('sys.chooser:search_role', {}, (result) => {
        if (result.success) {
            const children = [];
            for (let i = 0; i < result.data.length; i++) {
                children.push(<Option key={result.data[i].id} value={result.data[i].id}>{result.data[i].name}</Option>);
            }
            setRoleOption(children)
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
                        onFinish={onSaveStaff} >
                        <Form.Item label="员工姓名" name="trueName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        {adjustModal.disabled ? null : <Form.Item label="登录名" name="loginName" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>}
                        {adjustModal.disabled ? null : <Form.Item label="密码" name="password" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>}
                        <Form.Item label="权限" name="permissions">
                            <VoTreeSelect treeData={treeData} widthParentId={true} keyFiledName="id" parentFiledName="parentId" rootParentValue="" treeCheckable={true} />
                        </Form.Item>
                        <Form.Item label="角色" name="roleId">
                            <Select
                                mode="multiple"
                                allowClear
                                style={{ width: '100%' }}
                                placeholder="请选择角色"
                            >
                                {roleOption}
                            </Select>
                        </Form.Item>
                        <Form.Item label="手机号码" name="phone" rules={[{ required: true }]}>
                            <Input />
                        </Form.Item>
                        <Form.Item label="员工状态" name="status" rules={[{ required: true }]}>
                            <Select>
                                <Option value={0}>离职</Option>
                                <Option value={1}>在职</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="是否启用" name="enable" rules={[{ required: true }]}>
                            <Select>
                                <Option value={0}>账号禁用</Option>
                                <Option value={1}>账号启用</Option>
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
