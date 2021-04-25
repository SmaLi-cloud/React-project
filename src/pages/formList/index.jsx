import React from 'react';
import VoPermission from '@/pages/components/VoPermission';
import { Button } from 'antd';
import * as Tools from '@/utils/Tools';


const onClick=()=>{
  Tools.logMsg("sss")
}
const TableList = () => {

  return (
    <VoPermission permission="co.user.list.cols.operations.edit">
      <Button onClick={onClick}>ssss</Button>
    </VoPermission>
  );
};

export default TableList;
