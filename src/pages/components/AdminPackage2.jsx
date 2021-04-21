import React from 'react'
import PropTypes from 'prop-types'

/**
 * component expand
 * @param { Old Component} ChildComponent 
 * @param {string} opCode 
 * @param {string} permissions 
 * @returns New Component
 * 一级权限
 */
function roleCheck2(ChildComponent, opCode, permissions) {
  var perArr = [];
  // 在里面佛如循环
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        opCode: opCode,
      };
      this.roleChecked = false;
    }
    editClick() {
      console.log("you edit the button");
    }
    addClick(data) {
      console.log("you add the button" + data);
    }
    delClick() {
      console.log("you del the button");
    }
    render() {
      permissions.forEach((v, i) => {
        let attribute={};
        if (v == 'del') {
          attribute = {
            danger: true,
            value: "small",
            onClick: (data) => this.delClick(data)
          }
        }
        if (v == 'edit') {
          attribute = {
            value: "large",
            type:'primary',
            onClick: (data) => this.editClick(data)
          }
        }
        if (v == 'add') {
          attribute = {
            value: "small",
            onClick: (data) => this.addClick(data)
          }
        }
        perArr.push(<ChildComponent {...this.props} {...attribute} key={i}>{v}</ChildComponent>)
      })
      return perArr;

      //   //需要解决 opCode 问题，方案1:不停循环，方案2：待定，但是如果需要看功能，功能里可能是data数据或input或button
      //   if (this.state.opCode = "admin") {
      //     // custom component
      //     if (typeof ChildComponent == "function"){
      //       return  <ChildComponent {...this.props} key ={this.props.index} />
      //     }
      //     else if(typeof ChildComponent == "object") {
      //       // Antd component or chorme component 
      //       // 编辑按钮
      //       if ( permissions == "edit") {
      //         return <ChildComponent {...this.props} key ={this.props.index} onClick = {_=>{ this.props.onClick(); }} type ="primary">{value}</ChildComponent>  
      //       }
      //       // 添加按钮
      //       if (permissions == "add") {
      //         return <ChildComponent {...this.props} key ={this.props.index} onClick = {_=> this.addClick()} >{value}</ChildComponent>  
      //       }
      //       // 删除按钮
      //       if (permissions == "del") {
      //         const attribute={
      //           danger:true,
      //           value: "small",
      //           onClick : (data)=> this.delClick(data)
      //         }
      //         return <ChildComponent {...this.props} key ={this.props.index} {...attribute}>{value}</ChildComponent>  
      //       }
      //       }

      //   }
      //   if (this.state.opCode = "operator") {

      //   }
      // return <ChildComponent {...this.props} key ={this.props.index}>{value}</ChildComponent>;
    }
  };
}

export default roleCheck2;
