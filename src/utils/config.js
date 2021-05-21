const timeout = 5000;
const prefix = 'http://api.workbench.vo:8080';
const isDebug = true;
const authority = ["co","sys", "cus", "co.user", "co.staff","sys.permission","sys.role","sys.dictionary","sys.log","sys.sys_config", "cus.third_party_system",
"sys.api_server_list", "sys.emqx_server","sys.model", "sys.device"];

const config = {
    timeout,
    prefix,
    isDebug,
    authority,
  };
export default config;
