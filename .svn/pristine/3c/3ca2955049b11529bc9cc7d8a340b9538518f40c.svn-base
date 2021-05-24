import { callAPI } from '@/utils/tools';
import { Select, Spin } from 'antd';
import React from 'react';
import debounce from 'lodash/debounce';

const VoSearchSelect = (props) => {
  const [fetching, setFetching] = React.useState(false);
  const [options, setOptions] = React.useState(undefined);

  const debounceFetcher = React.useMemo(() => {
    const loadOptions = (value) => {
      setOptions([]);
      setFetching(true);
      let searchConditions = {
        page: 1,
        size: props.showCount,
        conditions: {}
      };
      searchConditions.conditions[props.labelFiled] = value;
      callAPI(props.searchAction, searchConditions, (result) => {
        let newOptions = [];
        newOptions = result.data.rows.map((row) => ({
          label: row[props.labelFiled],
          value: row[props.valueFiled]
        }));
        setOptions(newOptions);
        setFetching(false);
      });
    };
    return debounce(loadOptions, props.debounceTimeout);
  });
  return (
    <Select
      filterOption={false}
      onSearch={debounceFetcher}
      mode={props.mode}
      placeholder={props.placeholder}
      style={{ width: '100%' }}
      notFoundContent={fetching ? <Spin size="small" /> : null}
      onChange={(val) => {
        props.onChange(val)
      }}
      options={options || props.selectedOptions}
      value={props.value}
    />
  );
}

export default VoSearchSelect;