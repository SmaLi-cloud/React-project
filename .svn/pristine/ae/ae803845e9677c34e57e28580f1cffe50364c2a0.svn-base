import { callAPI, cloneDeep, logMsg } from '@/utils/tools';
import { Select, Spin } from 'antd';
import React, { useState, useRef, memo, forwardRef, useEffect } from 'react';
import debounce from 'lodash/debounce';

let debounceTimeout = 200;

const DebounceSelect = (props) => {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState([]);
  let copyOptions = cloneDeep(props.options)

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);
      let searchConditions = {
        page: 1,
        size: 5,
        conditions: { 'trueName': value }
      };
      callAPI('co.staff:search', searchConditions, (result) => {
        let newOptions = [];
        newOptions = result.data.rows.map((staff) => ({
          label: staff.trueName,
          value: staff.id
        }))
        setOptions(newOptions);
        setFetching(false);
      })
    };
    return debounce(loadOptions, debounceTimeout);
  }, [debounceTimeout]);
  return (
    <Select
      filterOption={false}
      onSearch={debounceFetcher}
      mode="multiple"
      placeholder="请选择员工"
      style={{
        width: '100%',
      }}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      {...props}
      onChange={(val) => {
        props.onChange(val)
      }}
      options={options.length > 0 ? options : copyOptions}
    />
  );
}

export default DebounceSelect;