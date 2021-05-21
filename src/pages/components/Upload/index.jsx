
import { Upload, message, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { logMsg } from '@/utils/tools';
import React, { useState, useRef, useEffect } from 'react';




const dictionaryList = () => {
    const props = {
        showUploadList: false,
        maxCount: 1,
        onChange(info) {
            // logMsg(info.file.status); 
        },
        customRequest(info){
            setUploading(true)
            logMsg(info.file)
            setFileName(info.file.name)
        },
        beforeUpload(file){
        }
    };

  const [uploading, setUploading] = useState(false);
  const [fileName, setFileName] = useState('');
    return (
        <>
            <Upload {...props}>
            <Button icon={<UploadOutlined />} loading={uploading}>{uploading ? '上传中' : '选择文件'} </Button>
            </Upload>
            <span>{fileName}</span>
        </>

    );
};

export default dictionaryList;


// import { Upload, Button, message } from 'antd';
// import { UploadOutlined } from '@ant-design/icons';

// class Demo extends React.Component {
//   state = {
//     fileList: [],
//     uploading: false,
//   };

//   handleUpload = () => {
//     const { fileList } = this.state;
//     const formData = new FormData();
//     fileList.forEach(file => {
//       formData.append('files[]', file);
//     });

//     this.setState({
//       uploading: true,
//     });
//   };

//   render() {
//     const { uploading, fileList } = this.state;
//     const props = {
//       onRemove: file => {
//         this.setState(state => {
//           const index = state.fileList.indexOf(file);
//           const newFileList = state.fileList.slice();
//           newFileList.splice(index, 1);
//           return {
//             fileList: newFileList,
//           };
//         });
//       },
//       beforeUpload: file => {
//         this.setState(state => ({
//           fileList: [...state.fileList, file],
//         }));
//         return false;
//       },
//       fileList,
//     };

//     return (
//       <>
//         <Upload {...props}>
//           <Button icon={<UploadOutlined />} loading={uploading}>{uploading ? '上传中' : '选择文件'} </Button>
//         </Upload>
//         <Button
//           type="primary"
//           onClick={this.handleUpload}
//           disabled={fileList.length === 0}
//           loading={uploading}
//           style={{ marginTop: 16 }}
//         >
//           {uploading ? '上传中' : '选择文件'}
//         </Button>
//       </>
//     );
//   }
// }
// export default Demo;