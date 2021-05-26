import * as Tools from '@/utils/tools';
import Storage from '@/utils/storage'
import { LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { Avatar, Menu, Spin, Dropdown, Modal, Form, Input, Button, message } from 'antd';
import React from 'react';
import { history } from 'umi';
import styles from './index.less';
import { stringify } from 'querystring';
import classNames from 'classnames';

const HeaderDropdown = ({ overlayClassName: cls, ...restProps }) => (
  <Dropdown overlayClassName={classNames(styles.container, cls)} {...restProps} />
);

class AvatarDropdown extends React.Component {
  constructor() {
    super()
    this.state = {
      isModalVisible: false
    }
    this.formRef = React.createRef();
  }

  logout = () => {
    const { redirect } = Tools.getPageQuery();
    if (window.location.pathname !== '/user/login' && !redirect) {
      history.replace({
        pathname: '/user/login',
        search: stringify({
          redirect: window.location.href,
        }),
      });
    }
  }
  resetPassword = () => {
    this.setState({ isModalVisible: true })
  }

  onMenuClick = (event) => {
    const { key } = event;
    Tools.logMsg(event)
    if (key === 'logout') {
      this.logout()
      return;
    }
    if (key === 'resetPassword') {
      this.resetPassword()
      return;
    }
  };
  getUserName = () => {
    let staffInfo = Storage.get('staffInfo')
    if (staffInfo) {
      return JSON.parse(staffInfo)[0].trueName;
    }
    return "未登录";
  }
  closeModal = () => {
    this.formRef.current.resetFields();
    this.setState({ isModalVisible: false })
  }
  onChangePassword = () => {
    let changePasswordOptions = 'co.staff:change_password'
    let changePasswordData = this.formRef.current.getFieldValue();
    Tools.callAPI(changePasswordOptions, changePasswordData , (result) => {
      if (result.success) {
        message.success('密码更新成功');
        this.setState({ isModalVisible: false })
      } else if (!result.success) {
        Tools.showMessage('密码更新失败', result.msg, 'error');
      }
    }, (result) => {
      console.log(result);
    })
  }
  formItemLayout = {
    labelCol: {
      span: 6,
    },
    wrapperCol: {
      span: 14,
    },
  };
  render() {
    const {
      currentUser = {
        avatar: 'https://www.jiepei.com/Content/img/top-header.png',
        name: this.getUserName(),
      },
      menu = this.getUserName() == '未登录' ? false : true,
    } = this.props;
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item key="logout">
          <LogoutOutlined />
          退出登录
        </Menu.Item>
        {menu && (
          <Menu.Item key="resetPassword">
            <SettingOutlined />
            密码修改
          </Menu.Item>
        )}
      </Menu>
    );
    return (
      <>
        {currentUser && currentUser.name ? (
          <HeaderDropdown overlay={menuHeaderDropdown}>
            <span className={`${styles.action} ${styles.account}`}>
              <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" />
              <span className={`${styles.name} anticon`}>{currentUser.name}</span>
            </span>
          </HeaderDropdown>
        ) : (
          <span className={`${styles.action} ${styles.account}`}>
            <Spin
              size="small"
              style={{
                marginLeft: 8,
                marginRight: 8,
              }}
            />
          </span>
        )}
        <Modal title='修改密码' footer={null} visible={this.state.isModalVisible} onCancel={this.closeModal}>
          <Form
            ref={this.formRef}
            {...this.formItemLayout}
            onFinish={this.onChangePassword}
          >
            <Form.Item label="原密码" name="oldPassword" rules={[{ required: true }]} >
              <Input.Password />
            </Form.Item>
            <Form.Item label="新密码" name="newPassword" rules={[{ required: true }]} >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="确认密码"
              name="confirmPassword"
              rules={[{ required: true },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入密码不一致!'));
                },
              })]} >
              <Input.Password />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
              <Button type="primary" htmlType="submit" >提交</Button>
              <Button type="primary" className={styles.btnCancel} onClick={this.closeModal}>取消</Button>
            </Form.Item>
          </Form>
        </Modal>
      </>

    )


  }
}

export default AvatarDropdown
