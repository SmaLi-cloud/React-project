/**
 * component expand
 * @param { Old Component} ChildComponent 
 * @param {Array} opCode 
 * @param {Array} permissions 
 * @returns New Component
 * 一级权限
 */
    function roleCheck(ChildComponent, opCode, permissions, ) {

      return class extends React.Component {
        constructor(props) {
          super(props);
          this.state = {
            opCode: opCode,
          };
          this.roleChecked = false;
        }
        checkRole() {
          this.roleChecked = true;
          console.log(this.roleChecked);
        }
        render() {
          console.log("render");
          if (
            typeof ChildComponent == "function" &&
            new ChildComponent({}).checkRole
          ) {
            return (
              <ChildComponent
                checkRoleFunc={() => this.checkRole()}
                {...this.props}
                {...permissions}
              />
            );
          } else {
            if (true) {
              return <ChildComponent {...this.props} {...permissions} />;
            }
          }
          return null;
        }
      };
    }
export default roleCheck;
  