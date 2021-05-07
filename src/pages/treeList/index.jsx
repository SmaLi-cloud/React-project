import React from 'react'
import * as Tools from '@/utils/tools'
import { Card, TreeSelect, Button, Modal, Form, Input } from 'antd';

class Demo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: [],
      treeData: [],
      isModalVisible: false
    };
    this.permissionId = new Set();
    this.rows = [];
  }
  showModal = () => {
    this.setState({ isModalVisible: true })
  };
  onSearch = value => {
    Tools.logMsg(value)
  }
  onChange = value => {
    // console.log('onChange ', value);
    this.permissionId.clear();
    this.setState({ value });
    if(value instanceof Array){
      value.forEach((v, i) => {
        this.permissionId.add(v)
        const parents = Tools.getTreeParent(this.state.treeData, "children", "parentId", "id", v)
        if (parents) {
          this.permissionId.add(...parents)
        }
      })
    }else {
      this.permissionId.add(value)
      const parents = Tools.getTreeParent(this.state.treeData, "children", "parentId", "id", value)
      if (parents) {
        this.permissionId.add(...parents)
      }
    }

    Tools.logMsg(Array.from(this.permissionId))
  };
  successCallBack = (result) => {
    // Tools.logMsg(result)
    this.rows = Tools.buildTree(result.data.rows, 'id', 'parentId', 'children', "")
    this.setState({ treeData: this.rows })
  }
  errorCallBack = (result) => {
    Tools.logMsg(result)
  }
  componentDidMount() {
    Tools.callAPI('sys.permission:search', { "conditions": {} }, this.successCallBack, this.errorCallBack)
  }
  render() {
    const tProps = {
      treeData: this.state.treeData,
      value: this.state.value,
      onChange: this.onChange,
      onSearch: this.onSearch,
      labelInValue: false,
      // treeCheckable: true,
      placeholder: 'Please select',
      style: {
        width: '50%',
      },
    };
    return (
      <Card>
        <TreeSelect {...tProps} />
        <Button onClick={this.showModal}>添加权限</Button>
        <Modal title="添加权限" visible={this.state.isModalVisible} >
          <Form>
            <Form.Item label="parent" name="parent">
              <TreeSelect {...tProps} />
            </Form.Item>
            <Form.Item label="name" name="name">
              <Input />
            </Form.Item>
            <Form.Item label="code" name="code">
              <Input />
            </Form.Item>
          </Form>
        </Modal>
      </Card>
    )
  }
}

export default Demo;
