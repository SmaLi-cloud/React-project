import React, { useState, useEffect, useRef } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
const { RangePicker } = DatePicker;

const VoRangePicker = (props) => {
    const [dates, setDates] = useState([]);
    const [hackValue, setHackValue] = useState();
    const [value, setValue] = useState([]);
    const disabledDate = current => {
        if (!props.maxDayRange) {
            return false;
        }
        if (!dates || dates.length === 0) {
            return false;
        }
        const tooLate = dates[0] && current.diff(dates[0], 'seconds') > props.maxDayRange * 24 * 3600;
        const tooEarly = dates[1] && dates[1].diff(current, 'seconds') > props.maxDayRange * 24 * 3600;
        return tooEarly || tooLate;
    };
    const onChange = (val) => {
        setValue(val);
        if (props.onChange) {
            props.onChange(val);
        }
    }
    const onOpenChange = open => {
        if (open) {
            setHackValue([]);
            setDates([]);
        } else {
            setHackValue(undefined);
        }
    };
    const onCalendarChange = val => {
        setDates(val);
    }
    const getValue = () => {
        if (hackValue) {
            return hackValue;
        }
        if (value && value.length) {
            return value;
        }
        return props.value;
    }
    return (
        <RangePicker
            showTime
            style={{ width: '100%' }}
            disabledDate={disabledDate}
            value={getValue()}
            onCalendarChange={onCalendarChange}
            onChange={onChange}
            onOpenChange={onOpenChange}
            inputReadOnly={true}
            ranges={{
                '今天': [moment().startOf('day'), moment()],
                '三天': [moment().subtract(3, 'days'), moment()],
                '本周': [moment().subtract(7, 'days'), moment()],
            }}
        />
    );
};
export default VoRangePicker;