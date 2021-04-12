function roleCheck(ChildComponent, srcProps, child) {
    console.log("roleCheck");
    debugger;
    if (
      typeof ChildComponent == "function" &&
      new ChildComponent({}).checkRole
    ) {
      return (
        <ChildComponent
          checkRoleFunc={() => checkRole()}
          {...srcProps}
        >{child}</ChildComponent>
      );
    } else {
      if (true) {
        return <ChildComponent {...srcProps}>{child}</ChildComponent>;
      }
    }
    return null;
  }
export default roleCheck;
  