import React, { useState,useEffect } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

import { logMsg } from '@/utils/tools';

const { RangePicker } = DatePicker;

const DatePickers = (props) => {
    const [dates, setDates] = useState([]);
    const [hackValue, setHackValue] = useState();
    const [value, setValue] = useState();
    const disabledDate = current => {
        if (!dates || dates.length === 0) {
            return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'days') > 6;
        const tooEarly = dates[1] && dates[1].diff(current, 'days') > 6;
        return tooEarly || tooLate;
    };

    const onOpenChange = open => {
        logMsg(open)
        if (open) {
            setHackValue([]);
            setDates([]);
        } else {
            setHackValue(undefined);
        }
    };
    const  onChange = val => {
        setValue(val);
    }
    const SetDefaultValue=()=> {
        if(props.defaultTime){
            props.onChange([moment().subtract(props.defaultTime, 'days'), moment()]);
            return [moment().subtract(props.defaultTime, 'days'), moment()]
        }
    }
return (
    <RangePicker
        showTime
        defaultValue ={()=> SetDefaultValue()}
        style={{ width: '100%' }}
        value={hackValue || value}
        disabledDate={disabledDate}
        onCalendarChange={val => setDates(val)}
        onChange={onChange}
        onOpenChange={onOpenChange}
        ranges={{
            '今天': [moment().startOf('day'), moment()],
            '本周': [moment().subtract(7, 'days'), moment()],
          }}

    />
);
};
export default DatePickers;