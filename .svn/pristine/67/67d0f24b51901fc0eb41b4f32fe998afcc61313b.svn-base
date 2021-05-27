import React, { useState, useEffect, useRef } from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';
import { logMsg } from '@/utils/tools';
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
            let timeData = {};
            if (val instanceof Array) {
                timeData.start = moment(val[0]).format('YYYY-MM-DD HH:mm:ss')
                timeData.end = moment(val[1]).format('YYYY-MM-DD HH:mm:ss')
            } else {
                timeData = moment(val).format('YYYY-MM-DD HH:mm:ss')
            }
            props.onChange(timeData);
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
        let propsValue = [];
        if (!props.value) {
            return propsValue;
        }
        if (!props.value['start']) {
            propsValue.push(undefined);
        }
        else {
            propsValue.push(moment(props.value['start'], "YYYY-MM-DD HH:mm:ss"));
        }
        if (!props.value['end']) {
            propsValue.push(undefined);
        }
        else {
            propsValue.push(moment(props.value['end'], "YYYY-MM-DD HH:mm:ss"));
        }
        return propsValue;
    }
    return (
        <RangePicker
            placeholder=""
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