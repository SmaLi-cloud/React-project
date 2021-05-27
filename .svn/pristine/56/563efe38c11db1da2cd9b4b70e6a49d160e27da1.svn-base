import React from 'react'
import * as Tools from '@/utils/tools'
import { TreeSelect } from 'antd';

class VoTreeSelect extends React.Component {
  constructor(props) {
    super(props);
    this.buildTreeDate = []
  }
  onChange = value => {
    if (this.props.onChange) {
      if (value instanceof Array) {
        let selectedIds = new Set();
        if (!(value instanceof Array)) {
          value = [value];
        }
        value.forEach((v, i) => {
          selectedIds.add(v);
          if (this.props.widthParentId) {
            const parents = Tools.getTreeParent(this.buildTreeDate, "children", this.props.parentFiledName, this.props.keyFiledName, v)
            if (parents) {
              selectedIds = new Set([...selectedIds, ...parents]);
            }
          }
        });
        this.props.onChange(Array.from(selectedIds));
      }
      else {
        this.props.onChange(value);
      }
    }
  };
  dropParents() {
    if (!(this.props.value instanceof Array)) {
      return this.props.value;
    }
    let leafIds = [];
    for (let i = 0; i < this.props.value.length; i++) {
      let isFind = false;
      for (let j = 0; j < this.props.treeData.length; j++) {
        if (this.props.value[i] == this.props.treeData[j][this.props.parentFiledName]) {
          isFind = true;
          break;
        }
      }
      if (!isFind) {
        leafIds.push(this.props.value[i]);
      }
    }
    return leafIds;
  }
  render() {
    this.buildTreeDate = Tools.cloneDeep(Tools.buildTree(this.props.treeData, this.props.keyFiledName, this.props.parentFiledName, 'children', this.props.rootParentValue));
    const tProps = {
      treeData: this.buildTreeDate,
      onChange: this.onChange,
      onSelect: this.props.onSelect,
      labelInValue: false,
      treeCheckable: this.props.treeCheckable,
      placeholder: this.props.placeholder,
      style: {
        width: '100%',
      },
      value: this.dropParents()
    };
    return (
      <TreeSelect {...tProps} />
    )
  }
}

export default VoTreeSelect;
