import React, { useState } from 'react';
import {
    Form,
    Input,
    Button,
    Radio,
    Select,
    Cascader,
    DatePicker,
    InputNumber,
    TreeSelect,
    Switch,
    Card,
} from 'antd';
import { SearchOutlined, RedoOutlined, PlusOutlined } from '@ant-design/icons';
import * as Tools from '@/utils/Tools';

const VoForm = () => {
    const [componentSize, setComponentSize] = useState('default');
    const FormData = [
        {
            title: '名字',
            key: 'name',
            display: true
        },
        {
            title: '邮箱',
            key: 'email',
            display: true
        },
        {
            title: '描述',
            key: 'description',
            display: true
        }]
    const onFormLayoutChange = ({ size }) => {
        setComponentSize(size);
    };

    return (
        <>
            <Card>
                <Form
                    labelCol={{ span: 4 }}
                    wrapperCol={{
                        span: 5,
                    }}
                    layout="horizontal"
                    initialValues={{
                        size: componentSize,
                    }}
                    onValuesChange={onFormLayoutChange}
                    size={componentSize}
                >
                    <Form.Item label="Form Size" name="size" >
                        <Radio.Group>
                            <Radio.Button value="small">Small</Radio.Button>
                            <Radio.Button value="default">Default</Radio.Button>
                            <Radio.Button value="large">Large</Radio.Button>
                        </Radio.Group>
                    </Form.Item>
                    {
                     FormData[2].display?  null:<Form.Item label="Input" >
                            <Input />
                        </Form.Item>
                    }

                    <Form.Item label="Select">
                        <Select>
                            <Select.Option value="demo">Demo</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="TreeSelect" wrapperCol={{ span: 12 }}>
                        <TreeSelect
                            treeData={[
                                {
                                    title: 'Light',
                                    value: 'light',
                                    children: [
                                        {
                                            title: 'Bamboo',
                                            value: 'bamboo',
                                        },
                                    ],
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="Cascader">
                        <Cascader
                            options={[
                                {
                                    value: 'zhejiang',
                                    label: 'Zhejiang',
                                    children: [
                                        {
                                            value: 'hangzhou',
                                            label: 'Hangzhou',
                                        },
                                    ],
                                },
                            ]}
                        />
                    </Form.Item>
                    <Form.Item label="DatePicker">
                        <DatePicker />
                    </Form.Item>
                    <Form.Item label="InputNumber">
                        <InputNumber />
                    </Form.Item>
                    <Form.Item label="Switch">
                        <Switch />
                    </Form.Item>
                    <Form.Item label="Button">
                        <Button type="primary" htmlType="submit">Submit</Button>
                    </Form.Item>
                </Form>
            </Card>

        </>
    );
};
export default VoForm