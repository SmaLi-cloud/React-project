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

class VoForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            componentSize: 'default'
        }
    }

    onFormLayoutChange = ({ size }) => {
        this.setState({
            componentSize: size
        });
    };

    render() {

        return (
            <>
                <Card>
                    <Form
                        labelCol={{
                            span: 4,
                        }}
                        wrapperCol={{
                         span: 14,
                        }}
                        layout="horizontal"
                        initialValues={{
                            size: this.state.componentSize,
                        }}
                        onValuesChange={this.onFormLayoutChange}
                        size={this.state.componentSize}
                    >
                        <Form.Item label="Form Size" name="size">
                            <Radio.Group>
                                <Radio.Button value="small">Small</Radio.Button>
                                <Radio.Button value="default">Default</Radio.Button>
                                <Radio.Button value="large">Large</Radio.Button>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item label="Input">
                            <Input />
                        </Form.Item>
                        <Form.Item label="Select">
                            <Select>
                                <Select.Option value="demo">Demo</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item label="TreeSelect">
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
                            <Button>Button</Button>
                        </Form.Item>
                    </Form>
                </Card>
            </>
        );
    }
}
export default VoForm