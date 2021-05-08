const timeout = 5000;
const prefix = 'http://api.workbench.vo:8080';
const isDebug = true;
const authority = ["co", "co.user", "co.staff","sys",'sys.permission','sys.role','sys.dictionary','sys.log'];

const config = {
    timeout,
    prefix,
    isDebug,
    authority,
  };
export default config;
