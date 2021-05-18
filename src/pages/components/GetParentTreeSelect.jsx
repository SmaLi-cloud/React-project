import React from 'react'
import * as Tools from '@/utils/tools'
import { Card, TreeSelect, Button, Modal, Form, Input } from 'antd';

class getParentTreeSelect extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: [],
      treeData: [],
    };
    this.permissionId = new Set();
    this.rows = [];
  }

  onSearch = value => {
    Tools.logMsg(value)
  }
  onChange = value => {
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
    this.props.onChange(Array.from(this.permissionId))
  };
  successCallBack = (result) => {
    this.rows = Tools.buildTree(result.data.rows, 'id', 'parentId', 'children', "")
    this.setState({ treeData: this.rows })
  }
  errorCallBack = (result) => {
    Tools.logMsg(result)
  }
  componentDidMount() {
    let treeList = Tools.cloneDeep(this.props.treeList)
    // Tools.logMsg(treeList)
    // Tools.callAPI('sys.permission:search', { "conditions": {} }, this.successCallBack, this.errorCallBack)
    this.rows = Tools.buildTree(treeList, 'id', 'parentId', 'children', "")
    this.setState({ treeData: this.rows ,value: this.props.initTreeValue })
    // Tools.logMsg('渲染')
  }

  render() {
    const tProps = {
      treeData: this.state.treeData,
      value: this.state.value,
      onChange: this.onChange,
      onSearch: this.onSearch,
      labelInValue: false,
      treeCheckable: true,
      placeholder: '请选择权限',
      style: {
        width: '100%',
      },
    };
    return (
        <TreeSelect {...tProps}  />
    )
  }
}

export default getParentTreeSelect;
