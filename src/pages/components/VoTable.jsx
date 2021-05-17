import { Table, Card, Form, Input, Button, Row, Col, Space, DatePicker, Select, Alert, TreeSelect, Popconfirm } from 'antd';
import React from 'react';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import moment from 'moment';
import DatePickers from './DatePicker'
import styles from './VoTable.less'
const { RangePicker } = DatePicker;

class VoTable extends React.Component {

    constructor(props) {
        super(props);
        if (!this.props.voPermission) {
            throw new Error("voPermission不能为空");
        }
        this.state = {
            paging: {
                position: ['bottomRight'],
                size: "small",
                showSizeChanger: true,
                showQuickJumper: true,
                ...this.props.paging
            },
            dataSource: [],
            loading: false,
            columns: this.getColConfig(),
            sorter: [],
            searchConditions: [],
            selectedRowKeys: [],
        };
        if (this.props.rowSelectType) {
            this.state.rowSelection = {
                type: this.props.rowSelectType,
                onChange: (selectedRowKeys) => {
                    this.setState({ selectedRowKeys: selectedRowKeys });
                }
            }
        }
        this.formRef = React.createRef();
    }
    getSelectedRowKeys() {
        return this.state.selectedRowKeys;
    }
    getColConfig() {
        let columns = this.props.columns || [];
        const permissions = Tools.getChildPermissions(this.props.voPermission);
        for (let i = 0; i < permissions.length; i++) {
            let permission = permissions[i];
            if (Tools.checkUserPermission(permission)) {
                continue;
            }
            let permissionNode = permission.replace(this.props.voPermission + ".", "").split('.');
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
        let opCols = this.props.opCols || [];
        let newOpCols = [];
        let opWidth = 0;
        for (let i = 0; i < opCols.length; i++) {
            if (Tools.checkUserPermission(this.props.voPermission + ".op." + opCols[i].key)) {
                newOpCols.push(opCols[i]);
                opWidth += opCols[i].width ? opCols[i].width : 100;
            }
        }
        if (opCols.length) {
            let attribute = {
                title: "操作",
                fixed: 'right',
                align: 'center',
                width: opWidth,
                render: (_, record) => {
                    const operations = [];
                    opCols.forEach((v, i) => {
                        if (v.key == "delete") {
                            operations.push(
                                <Popconfirm title="确定要删除么？" okText="是" cancelText="否" key={v.key} onConfirm={() => { v.onClick(record) }}>
                                    <Button type={v.type} icon={v.icon}>{v.title}</Button>
                                </Popconfirm>
                            )
                        } else if (v.key == "edit") {
                            operations.push(<Button onClick={() => { v.onClick(record, this.state.dataSource); }} type={v.type} key={v.key} icon={v.icon}>{v.title}</Button>);
                        } else {
                            operations.push(<Button onClick={function () { v.onClick(record); }} type={v.type} key={v.key} icon={v.icon}>{v.title}</Button>);
                        }
                    })
                    return operations;
                },
            }
            columns.push(attribute);
        }
        return columns;
    }

    getSearchForm() {
        const children = [];
        let element;
        if (this.props.searchs) {
            for (let i = 0; i < this.props.searchs.length; i++) {
                let defaultValue = "";
                if (this.state.searchConditions.hasOwnProperty(this.props.searchs[i].key)) {
                    defaultValue = this.state.searchConditions[this.props.searchs[i].key];
                }
                if (!Tools.checkUserPermission(this.props.voPermission + ".search." + this.props.searchs[i].key)) {
                    continue;
                }
                if (this.props.searchs[i].type == 'DatePicker') {
                    // transfer onChange Make the form get DatePickers value
                    element = <DatePickers onChange={(val) =>{}} />
                } else if (this.props.searchs[i].type == 'input') {
                    element = <Input value={defaultValue} style={{ width: '100%' }} />
                } else if (this.props.searchs[i].type == 'treeSelect') {
                    element = <TreeSelect value={defaultValue} treeData={this.props.searchs[i].dataSource} style={{ width: '100%' }} />
                }
                children.push(
                    <Col span={this.props.searchs[i].colSpan * 6} key={this.props.searchs[i].key}>
                        <Form.Item
                            name={this.props.searchs[i].key}
                            label={this.props.searchs[i].title}
                        >
                            {element}
                        </Form.Item>
                    </Col>,
                );
            }
        }

        return children.length > 0 ? children : null;
    }
    getToolBar() {
        const children = [];
        if (this.props.toolBar) {
            this.props.toolBar.forEach((v, i) => {
                if (!Tools.checkUserPermission(this.props.voPermission + ".tool_bar." + v.key)) {
                    return;
                }
                if (children.length == 0) {
                    children.push(<Button disabled={v.needRowSelected && this.state.selectedRowKeys.length == 0} type={v.type} key={v.key} onClick={v.onClick} icon={v.icon}>{v.title}</Button>);
                } else {
                    children.push(
                        <Button disabled={v.needRowSelected && this.state.selectedRowKeys.length == 0} type={v.type} onClick={v.onClick} style={{ marginLeft: 20 }} key={v.key} icon={v.icon} icon={v.icon}>{v.title}</Button>
                    )
                }
            });
        }
        return children;
    }
    formatSearchFormTime(timeValue) {
        let writeTime = {}
        if (timeValue instanceof Array) {
            writeTime.start = moment(timeValue[0]).format('YYYY-MM-DD HH:mm:ss')
            writeTime.end = moment(timeValue[1]).format('YYYY-MM-DD HH:mm:ss')
        } else {
            writeTime = moment(timeValue).format('YYYY-MM-DD HH:mm:ss')
        }
        this.state.searchConditions.writeTime = writeTime;
    }
    getSearchConditions() {
        this.state.searchConditions = this.formRef.current ? this.formRef.current.getFieldValue() : [];
        this.state.searchConditions = Tools.cloneDeep(this.state.searchConditions)
        Tools.logMsg(this.formRef.current.getFieldValue())
        if (this.state.searchConditions.writeTime) {
            this.formatSearchFormTime(this.state.searchConditions.writeTime)
        }
        let searchConditions = {
            page: this.state.paging.current,
            size: this.state.paging.pageSize,
            conditions: this.state.searchConditions
        };
        if (this.state.sorter) {
            searchConditions["order"] = {};
            searchConditions["order"][this.state.sorter["field"]] = (this.state.sorter["order"] == "descend" ? -1 : 1);
        }
        return searchConditions;
    }
    refreshData(current, pageSize, sorter) {
        this.setState({ loading: true })
        if (current) {

            this.state.paging.current = current;
        }
        if (pageSize) {
            this.state.paging.pageSize = pageSize;
        }
        this.state.sorter = sorter;
        if (this.props.dataSource instanceof Array) {
            this.dataSourceLoaded({ count: this.props.dataSource.length, rows: this.props.dataSource });
        }
        else {
            Tools.callAPI(this.props.dataSource, this.getSearchConditions(), (result) => {
                this.setState({ loading: false })
                if (result.success) {
                    Tools.logMsg(result)
                    this.dataSourceLoaded(result.data);
                    return result.data;
                }
            });
        }
    }
    componentDidMount() {
        this.refreshData(1);
    }
    dataSourceLoaded(data) {
        // Tools.logMsg('数据',data)
        this.state.paging.total = data.count;
        this.setState({ dataSource: data.rows, paging: this.state.paging });
    }
    getObjIndex(objList, attribute, value) {
        for (let i = 0; i < objList.length; i++) {
            if (objList[i][attribute] == value) {
                return i;
            }
        }
        return -1;
    }
    onResetClick() {
        this.formRef.current.resetFields();
    };
    onSearchClick() {
        this.refreshData(1);
    };
    render() {
        return (
            <>
                {
                    !this.getSearchForm() ? null : <Card style={{ marginBottom: 10 }}>
                        <Form
                            ref={this.formRef}
                        >
                            <Row gutter={24}>{this.getSearchForm()}</Row>
                            <Col span={24} style={{ textAlign: 'right' }}>
                                <Button type="primary" onClick={() => this.onSearchClick()} icon={<SearchOutlined />}>搜索</Button>
                                <Button style={{ margin: '0 8px' }} onClick={() => this.onResetClick()}>重置</Button>
                            </Col>
                        </Form>
                    </Card>
                }
                <Card>
                    <Space>
                        {this.getToolBar()}
                    </Space>
                    <Button type="link" className={styles.refresh} onClick={() => { this.refreshData(); }} icon={<RedoOutlined />}></Button>
                    <Table {...this.props.otherConfig} rowSelection={this.state.rowSelection} dataSource={this.state.dataSource} pagination={this.state.paging} columns={this.state.columns} onChange={(pagination, _, sorter) => { this.refreshData(pagination.current, pagination.pageSize, sorter) }} />
                </Card>
            </>
        )
    }
}

export default VoTable
