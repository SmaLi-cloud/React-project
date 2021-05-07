import { Popconfirm, Space, Menu, Dropdown, Button } from 'antd';
import React from 'react';
import ProTable from '@ant-design/pro-table';
import { DownOutlined } from '@ant-design/icons';
import Storage from '@/utils/storage';
import roleCheck from '@/pages/components/AdminPackage'
import roleCheck2 from '@/pages/components/AdminPackage'

import { getComponet,logMsg } from '../../utils/tools'
const RoleMap = {
    admin: {
        name: '管理员',
        desc: '仅拥有指定项目的权限',
    },
    operator: {
        name: '操作员',
        desc: '拥有所有权限',
    },
};

const opCode = Storage.get('permission')
const admin = Storage.get('admin')
// logMsg(opCode, admin);
const tableListDataSource = [];
const realNames = ['马巴巴', '测试', '测试2', '测试3'];
const nickNames = ['巴巴', '测试', '测试2', '测试3'];
const emails = ['baba@antfin.com', 'test@antfin.com', 'test2@antfin.com', 'test3@antfin.com'];
const phones = ['12345678910', '10923456789', '109654446789', '109223346789'];
const permissions = [[], ['权限点名称1', '权限点名称4'], ['权限点名称1'], []];
for (let i = 0; i < 5; i += 1) {
    tableListDataSource.push({
        outUserNo: `${102047 + i}`,
        avatar: `//work.alibaba-inc.com/photo/${102047 + i}.32x32.jpg`,
        role: i === 1 ? 'admin' : 'operator',
        realName: realNames[i % 4],
        nickName: nickNames[i % 4],
        email: emails[i % 4],
        phone: phones[i % 4],
        permission: permissions[i % 4],
        index: 0
    });
}
const MemberList = () => {
    const renderRemoveUser = (text) => (<Popconfirm key="popconfirm" title={`确认${text}吗?`} okText="是" cancelText="否">
        <a>{text}</a>
    </Popconfirm>);
    const columns = [
        {
            dataIndex: 'avatar',
            title: '成员名称',
            valueType: 'avatar',
            width: 150,
            render: (_, record) => (<>
                {record.nickName}
                {/* {logMsg(record.nickName)} */}
            </>),
        },
        {
            dataIndex: 'email',
            title: '账号',
        },
        {
            dataIndex: 'phone',
            title: '手机号',
        },
        {
            dataIndex: 'role',
            title: '角色',
            render: (_, record) => (
                <span>
                    {RoleMap[record.role || 'admin'].name}
                </span>
            )

        },
        {
            title: '操作',
            dataIndex: 'x',
            valueType: 'option',
            render: (_, record) => {
                const arr = [];
                if (record.role === 'admin') {
                    let Compant1 = roleCheck(Button, 'admin', 'del', "删除");
                    let Compant2 = roleCheck(Button, 'operator', 'out', "退出");
                    arr.push(<Compant1 />, <Compant2 />)
                }
                if (record.role === 'operator') {
                    let  Compant1 = roleCheck("a", 'operator', 'edit', "编辑");
                    let  Compant2 = roleCheck(Button, 'operator', 'add', "添加");
                    let Compant3 = roleCheck(Button, 'operator', 'del', "删除");
                    arr.push(<Compant1 />, <Compant2 />, <Compant3 />)
                }

                // return [<a key="edit" onClick={() => {logMsg("sss");}}>编辑</a>, <Popconfirm key="popconfirm" title={`确认吗?`} okText="是" cancelText="否" ><a>ssss</a></Popconfirm>];
                return arr;

            },
        },
    ];
    return (<ProTable columns={columns} request={(params, sorter, filter) => {
        // 表单搜索项会从 params 传入，传递给后端接口。
        // logMsg(params, sorter, filter);
        return Promise.resolve({
            data: tableListDataSource,
            success: true,
        });
    }} rowKey="outUserNo" pagination={{
        showQuickJumper: true,
    }} toolBarRender={false} search={false} />);
};
export default MemberList;