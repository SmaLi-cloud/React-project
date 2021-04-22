import React from 'react'

/**
 * component expand
 * @param { Old Component} ChildComponent 
 * @param {string} opCode 
 * @param {string} permissions 
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
      console.log("you edit the button");
    }
    addClick(data) {
      console.log("you add the button"+data);
    }
    delClick() {
      console.log("you del the button");
    }
    render() {
      // permissions.forEach()
      //需要解决 opCode 问题，方案1:不停循环，方案2：待定，但是如果需要看功能，功能里可能是data数据或input或button
      if (this.state.opCode = "admin") {
        // custom component
        if (typeof ChildComponent == "function"){
          return  <ChildComponent {...this.props} key ={this.props.index} />
        }
        else if(typeof ChildComponent == "object") {
          // Antd component or chorme component 

          if ( permissions == "edit") {
            return <ChildComponent {...this.props} key ={this.props.index} onClick = {_=>{ this.props.onClick(); }} type ="primary">{value}</ChildComponent>  
          }

          if (permissions == "add") {
            const attribute={
              type: "primary",
              value: "small",
              onClick : _=> this.addClick()
            }
            return <ChildComponent {...this.props} key ={this.props.index} {...attribute} >{value}</ChildComponent>  
          }

          if (permissions == "del") {
            const attribute={
              danger:true,
              value: "small",
              onClick : (data)=> this.delClick(data)
            }
            return <ChildComponent {...this.props} key ={this.props.index} {...attribute}>{value}</ChildComponent>  
          }
          
          if (permissions == "out") {
            const attribute={
              style:{backgroundColor:"#f50",color:"#fff"},
              value: "small",
              onClick : (data)=> this.delClick(data)
            }
            return <ChildComponent {...this.props} key ={this.props.index} {...attribute}>{value}</ChildComponent>  
          }
          }

      }
      if (this.state.opCode = "operator") {

      }
    return <ChildComponent {...this.props} key ={this.props.index}>{value}</ChildComponent>;
    }
  };
}

export default roleCheck;
