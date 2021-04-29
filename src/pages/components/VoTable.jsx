import { Table, Card, Form, Input, Button, Row, Col, Space, DatePicker, Select } from 'antd';
import React from 'react';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/Tools';
import styles from './VoTable.less'

class VoTable extends React.Component {

    constructor(props) {
        super(props);
        let columns = this.props.tableConfig.columns;
        let searchs = this.props.tableConfig.searchs;
        let toolBar = this.props.tableConfig.toolBar;
        let opCols = this.props.tableConfig.opCols;
        if (this.props.tableConfig.voPermission) {
            const permissions = Tools.getChildPermissions(this.props.tableConfig.voPermission);
            for (let i = 0; i < permissions.length; i++) {
                let permission = permissions[i];
                //judge Whether to control permissions
                if (Tools.checkUserPermission(permission)) {
                    continue;
                }
                let permissionNode = permission.replace(this.props.tableConfig.voPermission + ".", "").split('.');
                if (permissionNode[0] == "cols") {
                    const index = this.getObjIndex(columns, 'key', permissionNode[1]);
                    if (index >= 0 && permissionNode.length == 2) {
                        columns.splice(index, 1);
                    }
                    else if (index >= 0 && permissionNode.length == 3) {
                        if (permissionNode[1] == "opCols") {
                            let operationIndex = this.getObjIndex(opCols, 'key', permissionNode[2]);
                            if (operationIndex >= 0) opCols.splice(operationIndex, 1);
                        }
                        if (permissionNode[1] == "operations") {
                            let operationIndex = this.getObjIndex(columns[index]['operations'], 'key', permissionNode[2]);
                            columns[index]['operations'].splice(operationIndex, 1);
                        }

                    }
                }
                if (permissionNode[0] == "search") {
                    const index = this.getObjIndex(searchs, 'key', permissionNode[1]);
                    if (index >= 0 && permissionNode.length == 2) {
                        searchs.splice(index, 1);
                    }
                }
                if (permissionNode[0] == "toolBar") {
                    for (let i = 0; i < toolBar.length; i++) {
                        if (toolBar[i] == permissionNode[1]) {
                            toolBar.splice(i, 1)
                        }
                    }
                }

            }
        }

        let opIndex = this.getObjIndex(columns, 'key', 'operations');
        if (opIndex >= 0) {
            let operationsCol = columns[opIndex];
            let opCol = {
                title: operationsCol.title,
                valueType: 'option',
                key: 'operations',
                render: () => {
                    const operations = [];
                    for (let i = 0; i < operationsCol["operations"].length; i++) {
                        if (operationsCol["operations"][i].type == "button") {
                            operations.push(<button key={operationsCol["operations"][i].key} onClick={(a, b, c) => { operationsCol["operations"][i].onClick(a, b, c); }}>{operationsCol["operations"][i].title}</button>);
                        }
                        else if (operationsCol["operations"][i].type == "link") {
                            operations.push(<a key={operationsCol["operations"][i].key} onClick={(a, b, c) => { operationsCol["operations"][i].onClick(a, b, c); }}>{operationsCol["operations"][i].title}</a>);
                        }
                    }
                    return operations;
                },
            }
            columns[opIndex] = opCol;
        }
        let opColsIndex = this.getObjIndex(columns, 'key', 'opCols');
        if (opColsIndex >= 0) {
            let operationsCol = columns[opColsIndex];
            let attribute = {
                ...operationsCol,
                render: () => {
                    const operations = [];
                    opCols.forEach((v, i) => {
                        operations.push(<Button type={v.type} key={v.key} >{v.title}</Button>);
                    })
                    return operations;
                },
            }
            columns[opColsIndex] = attribute;
        }


        this.state = {
            columns: columns,
            dataSource: this.props.tableConfig.dataSource,
            selectedRowKeys: []
        };
        this.searchs = searchs;
        this.toolBar = toolBar;
    }

    getObjIndex(objList, attribute, value) {
        for (let i = 0; i < objList.length; i++) {
            if (objList[i][attribute] == value) {
                return i;
            }
        }
        return -1;
    }
    tooBarClick = () => {
        console.log("click toobar");
    }
    getToolBar = () => {
        const children = [];
        this.toolBar.forEach((v, i) => {
            children.push(
                <Button type={v.type} onClick={() => v.onClick()} style={{ marginBottom: 20 }} key={i} icon={v.icon}>{v.title}</Button>
            )
        });
        return children
    }
    getFields = () => {
        const children = [];
        let frame;
        for (let i = 0; i < this.searchs.length; i++) {
            if (this.searchs[i].type == 'datePicker') {
                frame = <DatePicker />
            } else if (this.searchs[i].type == 'input') {
                frame = <Input placeholder="placeholder" />
            } else if (this.searchs[i].type == 'select') {
                frame = <Select style={{ width: 120 }}>
                    <Select.Option value="lucy">Lucy</Select.Option>
                </Select>
            }
            children.push(
                <Col span={8 * this.searchs[i].colSpan} key={i}>
                    <Form.Item
                        name={`${this.searchs[i].title}`}
                        label={`${this.searchs[i].title}`}
                    >
                        {frame}
                        {/* <DatePicker/> */}
                    </Form.Item>
                </Col>,
            );
        }
        return children.length > 0 ? children : null;
    };

    onSelectChange = (selectedRowKeys, selectRows) => {
        Tools.logMsg(selectRows);
        this.setState({ selectedRowKeys });
    };

    render() {
        const rowSelection = {
            selectedRowKeys: this.state.selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const pagination = {
            position: ['bottomRight'],
            size: "small",
            showSizeChanger: true,
            showQuickJumper: true,
            ...this.props.tableConfig.paging
        }
        const onReset = () => {
            formRef.current.resetFields();
        };
        const formRef = React.createRef();

        const onFinish = (values) => {
            Tools.logMsg(values);
        };
        return (
            <>
                {
                    !this.getFields() ? null : <Card style={{ marginBottom: 10 }}>
                        <Form
                            onFinish={onFinish}
                            ref={formRef}
                        >
                            <Row gutter={24}>{this.getFields()}</Row>
                            {this.state.columns.length == 0 ? null :
                                <Col span={24} style={{ textAlign: 'right' }}>
                                    <Button type="primary" htmlType="submit" icon={<SearchOutlined />}>Search</Button>
                                    <Button style={{ margin: '0 8px' }} onClick={_ => onReset()}>Clear</Button>
                                </Col>
                            }

                        </Form>
                    </Card>
                }
                <Card>
                    <Space>
                        {this.getToolBar()}
                    </Space>
                    <Button type="link" className={styles.refresh} icon={<RedoOutlined />}></Button>
                    <Table {...this.state} pagination={pagination} rowSelection={rowSelection} />
                </Card>
            </>
        )
    }
}

export default VoTable
