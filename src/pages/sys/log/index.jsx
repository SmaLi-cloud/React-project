import VoTable from '@/pages/components/VoTable';
import React, { useState, useRef, useEffect } from 'react';
import { Modal, Form, Select, message, Input } from 'antd';
import { EditOutlined, PlusOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/tools';
import moment from 'moment';
import { PageContainer } from '@ant-design/pro-layout';

const dictionaryList = () => {

  const table = useRef();

  const searchs = [
    {
      title: '类型',
      dataIndex: '',
      key: 'type',
      type: 'input',
      colSpan: 1,
      defaultValue: "",
      placeholder: "",
      dataSource: [],
    },
    {
      title: 'ip地址',
      dataIndex: '',
      key: 'ip',
      type: 'input',
      colSpan: 1,
      defaultValue: "",
      placeholder: "",
      dataSource: [],
    },

    {
      title: '请求时间',
      dataIndex: '',
      key: 'writeTime',
      type: 'RangePicker',
      colSpan: 2,
      defaultValue: "",
      placeholder: "",
      dataSource: [],
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
      title: 'ip地址',
      dataIndex: 'ip',
      key: 'ip',
    },

    {
      title: '日志标题',
      dataIndex: 'title',
      // sorter: true,
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
        Tools.callAPI('sys.log:delete_by_ids', { ids: table.current.state.selectedRowKeys }, (result) => {
          if (result.success) {
            message.success('删除成功');
            table.current.state.selectedRowKeys = []
            table.current.refreshData()
          } else if (!result.success) {
            Tools.showMessage('删除失败', result.msg);
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
      key: 'Unfold',
      title: "详情",
      type: "link",
      icon: <EyeOutlined />,
      onClick:  (record) => {
        let logContent = record.content;
       if(typeof record.content !== 'string'){
         logContent = JSON.stringify(logContent)
       }
        Modal.info({
          title: '日志信息详情',
          width: 1250,
          height:600,
          content: (
            <div>
              {/* highLight插件 */}
              <Input.TextArea value={logContent} autoSize={{ minRows: 5, maxRows: 10 }}/>
            </div>
          ),
          onOk() { },
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
        Tools.callAPI('sys.log:delete', { logId: record.id }, (result) => {
          if (result.success) {
            message.success('删除成功');
            table.current.state.selectedRowKeys = []
            table.current.refreshData()
          } else if (!result.success) {
            Tools.showMessage('删除失败', result.msg);
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
    dataSource: 'sys.log:search',
    otherConfig: {
      rowKey: "id",
      bordered: true,
    },
    rowSelectType: 'checkbox',
    voPermission: "sys.staff.log",
  };
  const setWriteTime = (day) => {
    let writeTime = {}
    writeTime.end = moment().format('YYYY-MM-DD HH:mm:ss');
    writeTime.start = moment().subtract(day, 'days').format('YYYY-MM-DD HH:mm:ss');
    return writeTime;
  }
  useEffect(() => {

  }, []);


  return (
    <>
      <PageContainer
        header={{
          title: '字典管理',
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

export default dictionaryList;
