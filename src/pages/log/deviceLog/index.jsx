import VoTable from '@/components/Vo/VoTable';
import React, { useRef, useState ,useEffect } from 'react';
import { Modal, message, Input } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';

const apiLogList = () => {

  const table = useRef();
  const [thirdPartySystemOptions, setThirdPartySystemOptions] = useState([]);

  const searchs = [
    {
      title: '设备编码',
      key: 'deviceId',
      type: 'input',
      colSpan: 1,
    },
    {
      title: '第三方系统',
      key: 'accountId',
      type: 'select',
      colSpan: 1,
      dataSource:thirdPartySystemOptions
    },
    {
      title: '发送时间',
      key: 'sendTime',
      type: 'DatePicker',
      colSpan: 2,
      defaultValue: { "start": moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'), "end": moment().format('YYYY-MM-DD HH:mm:ss') },
      placeholder: '',
      maxDayRange: 7,
    }
  ];
  const columns = [
    {
      title: '设备名称',
      dataIndex: 'deviceName',
      key: 'deviceName',
    },
    {
      title: '设备编码',
      dataIndex: 'deviceId',
      key: 'deviceId',
    },
    {
      title: '账户名称',
      dataIndex: 'accountName',
      key: 'accountName',
    },
    {
      title: '发送时间',
      dataIndex: 'sendTime',
      sorter: true,
      key: 'sendTime',
    },
    {
      title: '指令',
      dataIndex: 'cmd',
      key: 'cmd',
      render: (data) => {
        if (typeof data !== 'string') {
          data = JSON.stringify(data)
        }
        return data;
      }
    },
  ];
  const paging = {
    pageSize: 20,
    current: 1,
    total: 0,
    pageSizeOptions: [10, 20, 50, 100]
  };
  const opCols = [
    // {
    //   key: 'Unfold',
    //   title: "详情",
    //   type: "link",
    //   icon: <EyeOutlined />,
    //   onClick: (record) => {
    //     let logContent = record.cmd;
    //     if (typeof record.content !== 'string') {
    //       logContent = JSON.stringify(logContent)
    //     }
    //     Modal.info({
    //       title: '日志信息详情',
    //       width: 1250,
    //       height: 600,
    //       content: (
    //         <div>
    //           {/* highLight插件 */}
    //           <Input.TextArea value={logContent} autoSize={{ minRows: 5, maxRows: 10 }} />
    //         </div>
    //       ),
    //     });
    //   },
    //   width: 100
    // },
  ]
  const tableConfig = {
    columns,
    paging,
    searchs,
    opCols,
    dataSource: 'sys.log:device_search',
    otherConfig: {
      rowKey: "id",
      bordered: true,
    },
    voPermission: "sys.log",
  };
  useEffect(() => {
    Tools.callAPI('cus.third_party_system:search', { conditions: {}, page: 1, size: 10000 }, (result) => {
      if (result.success) {
        let options = result.data.rows.map((v, i) => {
          return { label: v.fullName, value: v.id }
        })
        setThirdPartySystemOptions(options)
      }
    });
  }, []);
  return (
    <>
      <PageContainer
        header={{
          title: '设备日志',
          breadcrumb: {
            routes: [{ breadcrumbName: '系统管理' }, { breadcrumbName: '当前页面' }]
          }
        }}
      >
        <VoTable {...tableConfig} ref={table} />
      </PageContainer>
    </>
  );
};

export default apiLogList;
