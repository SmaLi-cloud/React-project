
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { callAPI, showMessage } from '@/utils/tools';
import React, { useState } from 'react';

const VoUpload = (props) => {

    const [uploading, setUploading] = useState(false);
    const [fileName, setFileName] = useState('');
    const uploadProps = {
        showUploadList: false,
        maxCount: 1,
        customRequest(info) {
            let fileName = info.file.name.split('.')[info.file.name.split('.').length - 1];
            if (props.allowFile) {
                if (!fileName || props.allowFile.indexOf(fileName) == -1) {
                    showMessage('上传格式错误', '请选择上传扩展名为' + props.allowFile + '的文件!');
                    return;
                }
            }
            setUploading(true);
            setFileName(info.file.name)
            const reader = new FileReader();
            reader.readAsDataURL(info.file);
            reader.onload = function () {
                if (reader.readyState == 2) {
                    let baseData = reader.result.split('base64,')[1];
                    let uplaodData = props.uploadData || [];
                    uplaodData[props.uploadFileKey] = baseData;
                    callAPI(props.uploadAction, { fileContent: baseData }, (result) => {
                        if (props.successCallback) {
                            props.successCallback(result);
                        }
                        setFileName('');
                        setUploading(false);
                    });
                }
            };
        },
    };

    return (
        <>
            <Upload {...uploadProps}>
                <Button loading={uploading} type={props.propsValue.type} key={props.propsValue.key} icon={<UploadOutlined />} style={props.style}>{uploading ? '上传中' : '上传文件'} </Button>
            </Upload>
            <span>{fileName}</span>
        </>

    );
};

export default VoUpload;
