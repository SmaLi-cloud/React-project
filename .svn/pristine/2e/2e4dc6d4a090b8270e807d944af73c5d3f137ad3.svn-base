# 物联网后台管理系统
本项目使用[Ant Design Pro]框架进行初始化。下面是如何使用的快速指南。

# 环境准备

## 准备环境

你的本地环境需要安装 [yarn](https://yarnpkg.com/)、[node](http://nodejs.org/) 和 git

yarn依赖 ：Yarn是您的第一个react项目依赖项，直接运行该命令

```
npm install -g yarn
```

node.js安装下载地址：http://nodejs.cn/

git安装下载地址：  https://git-scm.com/

### 本地开发

安装依赖

```js
npm install   //安装包和依赖
```

```js
npm start    //运行后会出现localhost:8000/
```

# **react组件**

## antd组件

antd组件主要是一些小型模块

地址：https://ant.design/index-cn

通过 import 的方式导入所需要的组件

```jsx
import { Dropdown, Button } from 'antd';

<Button key="1" onClick={ activateLasers }>次要按钮</Button>,
```



## [ProComponents](https://procomponents.ant.design/)组件

地址：https://procomponents.ant.design/



ProComponents 是基于 Ant Design 而开发的模板组件，提供了更高级别的抽象支持，开箱即用。可以显著的提升制作 CRUD 页面的效率，更加专注于页面。

- [ProLayout](https://procomponents.ant.design/components/layout) 解决布局的问题，提供开箱即用的菜单和面包屑功能

- [ProTable](https://procomponents.ant.design/components/table) 表格模板组件，抽象网络请求和表格格式化

- [ProForm](https://procomponents.ant.design/components/form) 表单模板组件，预设常见布局和行为

- [ProCard](https://procomponents.ant.design/components/card) 提供卡片切分以及栅格布局能力

- [ProDescriptions](https://procomponents.ant.design/components/descriptions) 定义列表模板组件，ProTable 的配套组件

- [ProSkeleton](https://procomponents.ant.design/components/skeleton) 页面级别的骨架屏

  

ProComponents组件基本上所提供的模板要比antd更为高级，更加抽象。

```jsx
const ProFormText = (props) => {
  return (
    <ProForm.Item {...props}>
      <Input placeholder={props.placeholder} {...props.fieldProps} />
    </ProForm.Item>
  );
};
```

