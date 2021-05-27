import VoTable from '@/components/Vo/VoTable';
import React, { useRef, useState, useEffect } from 'react';
import * as Tools from '@/utils/tools';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';

const deviceLogList = () => {

  const table = useRef();
  const [thirdPartySystemOptions, setThirdPartySystemOptions] = useState([]);

  const getDeviceId = () => {
    if (location.search) {
      let params = Tools.getUrlParams()
      if (params.deviceId) {
        return params.deviceId;
      }
    }
    return "";
  };
  const searchs = [
    {
      title: '设备编码',
      key: 'deviceId',
      type: 'input',
      colSpan: 1,
      defaultValue: getDeviceId()
    },
    {
      title: '第三方系统',
      key: 'accountId',
      type: 'select',
      colSpan: 1,
      dataSource: thirdPartySystemOptions
    },
    {
      title: '发送时间',
      key: 'sendTime',
      type: 'DatePicker',
      colSpan: 2,
      defaultValue: { "start": moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'), "end": moment().format('YYYY-MM-DD HH:mm:ss') },
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

  const tableConfig = {
    columns,
    paging,
    searchs,
    dataSource: 'log.log:device_search',
    otherConfig: {
      rowKey: "id",
      bordered: true,
    },
    voPermission: "log.device_log.list",
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
          title: '设备日志管理',
          breadcrumb: {
            routes: [{ breadcrumbName: '日志管理' }, { breadcrumbName: '当前页面' }]
          }
        }}
      >
        <VoTable {...tableConfig} ref={table} />
      </PageContainer>
    </>
  );
};

export default deviceLogList;
