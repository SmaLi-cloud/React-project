import VoTable from '@/components/Vo/VoTable';
import React, { useRef } from 'react';
import { Modal, message, Input } from 'antd';
import { DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';

const apiLogList = () => {

  const table = useRef();

  const searchs = [
    {
      title: '类型',
      key: 'type',
      type: 'input',
      colSpan: 1,
    },
    {
      title: 'Ip地址',
      key: 'ip',
      type: 'input',
      colSpan: 1,
    },
    {
      title: '请求时间',
      key: 'writeTime',
      type: 'DatePicker',
      colSpan: 2,
      defaultValue: { "start": moment().subtract(7, 'days').format('YYYY-MM-DD HH:mm:ss'), "end": moment().format('YYYY-MM-DD HH:mm:ss') },
      placeholder: '',
      maxDayRange: 7,
    }
  ];
  const columns = [
    {
      title: '类型',
      dataIndex: 'type',
      key: 'type',
    },
    {
      title: '账户名称',
      dataIndex: 'accountName',
      key: 'accountName',
    },
    {
      title: 'Ip地址',
      dataIndex: 'ip',
      key: 'ip',
    },

    {
      title: '日志标题',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '请求时间',
      dataIndex: 'writeTime',
      sorter: true,
      key: 'writeTime',
    },
  ];
  const paging = {
    pageSize: 20,
    current: 1,
    total: 0,
    pageSizeOptions: [10, 20, 50, 100]
  };
  const toolBar = [
    {
      title: '批量删除',
      type: 'primary',
      key: 'batchdelete',
      needRowSelected: true,
      icon: <DeleteOutlined />,
      onClick: () => {
        Tools.callAPI('log.log:api_delete_by_ids', { ids: table.current.state.selectedRowKeys }, (result) => {
          if (result.success) {
            message.success('删除成功');
            table.current.state.selectedRowKeys = []
            table.current.refreshData()
          } else if (!result.success) {
            Tools.showMessage('删除失败', result.msg, 'error');
            return;
          }
        }, (result) => {
          console.log(result);
        })
      }
    }
  ];
  const opCols = [
    {
      key: 'unfold',
      title: "详情",
      type: "link",
      icon: <EyeOutlined />,
      onClick: (record) => {
        let logContent = record.content;
        if (typeof record.content !== 'string') {
          logContent = JSON.stringify(logContent)
        }
        Modal.info({
          title: '日志信息详情',
          width: 1250,
          height: 600,
          content: (
            <div>
              {/* highLight插件 */}
              <Input.TextArea value={logContent} autoSize={{ minRows: 5, maxRows: 10 }} />
            </div>
          ),
        });
      },
      width: 100
    },
    {
      key: 'delete',
      title: "删除",
      type: "link",
      icon: <DeleteOutlined />,
      onClick: function (record) {
        Tools.callAPI('log.log:api_delete', { logId: record.id }, (result) => {
          if (result.success) {
            message.success('删除成功');
            table.current.state.selectedRowKeys = []
            table.current.refreshData()
          } else if (!result.success) {
            Tools.showMessage('删除失败', result.msg, 'error');
            return;
          }
        }, (result) => {
          console.log(result);
        })
      },
      width: 100
    }
  ]
  const tableConfig = {
    columns,
    paging,
    searchs,
    opCols,
    toolBar,
    dataSource: 'log.log:api_search',
    otherConfig: {
      rowKey: "id",
      bordered: true,
    },
    rowSelectType: 'checkbox',
    voPermission: "log.api_log.list",
  };

  return (
    <>
      <PageContainer
        header={{
          title: 'API日志管理',
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

export default apiLogList;
