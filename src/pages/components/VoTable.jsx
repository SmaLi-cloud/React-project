import { Table, Card, Form, Input, Button, Pagination, Row, Col } from 'antd';
import React from 'react';
import * as Tools from '@/utils/Tools';
import ProCard from '@ant-design/pro-card';
import ProTable from '@ant-design/pro-table';


class VoTable extends React.Component {

    constructor(props) {
        super(props);
        let columns = this.props.tableConfig.columns;
        if (this.props.tableConfig.voPermission) {
            const permissions = Tools.getChildPermissions(this.props.tableConfig.voPermission);
            for (let i = 0; i < permissions.length; i++) {
                let permission = permissions[i];
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
                        let operationIndex = this.getObjIndex(columns[index]['operations'], 'key', permissionNode[2]);
                        columns[index]['operations'].splice(operationIndex, 1);
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

        this.state = {
            columns: columns,
            dataSource: this.props.tableConfig.dataSource,
        };
    }

    getObjIndex(objList, attribute, value) {
        for (let i = 0; i < objList.length; i++) {
            if (objList[i][attribute] == value) {
                return i;
            }
        }
        return -1;
    }

    getFields = () => {
        const count = this.state.columns.length;
        const children = [];
        for (let i = 0; i < count; i++) {
            children.push(
                <Col span={6} key={i}>
                    <Form.Item
                        name={`${this.state.columns[i].key}`}
                        label={`${this.state.columns[i].title}`}
                    >
                        <Input placeholder="请输入" />
                    </Form.Item>
                </Col>,
            );
        }
        return children;
    };
    onReset = () => {
        this.formRef.current.resetFields();
      };
    formRef = React.createRef();
      
    render() {
        const pagination = {
            total: 50,
            position: ['bottomRight'],
            size: "small",
            showSizeChanger: true,
            showQuickJumper: true
        }
        
        const onFinish = (values) => {
            Tools.logMsg(values);
          };
        return (
            <>
                <Card style={{marginBottom:10}}>
                    <Form
                    onFinish={onFinish}
                    ref={this.formRef}
                    >
                        <Row gutter={24}>{this.getFields()}</Row>
                        {this.state.columns.length == 0 ? null :
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button type="primary" htmlType="submit">Search</Button>
                                <Button style={{ margin: '0 8px' }} onClick={_=>this.onReset()}>Clear</Button>
                            </Col>
                        }

                    </Form>
                </Card>
                <Card>
                    {/* <ProTable {...this.state} /> */}
                    <Table {...this.state} pagination={pagination} />
                </Card>
            </>


        )
    }
}
export default VoTable