import React from 'react' 
/**
 * component expand
 * @param { Old Component} ChildComponent 
 * @param {Array} opCode 
 * @param {Array} permissions 
 * @returns New Component
 * 一级权限
 */
function roleCheck(ChildComponent, opCode, permissions,value) {

  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        opCode: opCode,
      };
      this.roleChecked = false;
    }
    editClick() {
      console.log("you click the button");
    }
    addClick() {
      console.log("you click the button");
    }
    delClick() {
      console.log("you click the button");
    }
    render() {
      //需要解决 opCode 问题，方案1:不停循环，方案2：待定，但是如果需要看功能，功能里可能是data数据或input或button
      if (this.state.opCode = "admin") {
        // custom component
        if (typeof ChildComponent == "function"){
          return  <ChildComponent {...this.props} key ={this.props.index} />
        }
        // Antd component or chorme component 
        // 编辑按钮
        if (typeof ChildComponent == "object" && permissions == "edit") {
          return <ChildComponent {...this.props} key ={this.props.index} onClick = {()=> this.editClick()}>{value}</ChildComponent>  
        }
        // 添加按钮
        if (typeof ChildComponent == "object" && permissions == "add") {
          return <ChildComponent {...this.props} key ={this.props.index} onClick = {()=> this.addClick()}>{value}</ChildComponent>  
        }
        // 删除按钮
        if (typeof ChildComponent == "object" && permissions == "del") {
          return <ChildComponent {...this.props} key ={this.props.index} onClick = {()=> this.delClick()}>{value}</ChildComponent>  
        }
      }
      //问题代码 等待解决
      if (
        typeof ChildComponent == "object" && permissions == "edit"
      ) {
        return (
          <ChildComponent {...this.props}   key ={this.props.index}>{value}</ChildComponent>
        );
      } else {        
          return <ChildComponent {...this.props}  onClick = {() => {console.log("sdsd");}} key ={this.props.index}>{value}</ChildComponent>;
      }
      return null;
    }
  };
}

export default roleCheck;
