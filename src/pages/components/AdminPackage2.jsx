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
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        opCode: opCode,
      };
      // this.roleChecked = false;
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
      if(this.state.opCode == 'admin') {
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
      }
      //permission "operator"
      if(opCode == "operator"){
        let attribute = {};
        permissions.forEach((v,i)=>{
            attribute={
              color: v
            }
          perArr.push(<ChildComponent {...this.props} {...attribute} key={i}>{v}</ChildComponent>)
        })
      }

      return perArr;
    }
  };
}

export default roleCheck2;
