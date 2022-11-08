import { SettingFilled, UserOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Space } from 'antd';
import React from 'react';

/**
 * 
 * @param {object} param
 * @param {() => void} param.logout 
 */
export default function Settings({ logout }) {
    return (
        <>
            <Space>
                <Button type="ghost" shape='round' size='large'>글 작성하기</Button>
                <Dropdown
                    overlayClassName="setting-dropbox"
                    overlay={
                        <Menu>
                            <Menu.Item onClick={logout}>로그아웃</Menu.Item>
                        </Menu>
                    }
                    trigger={['click']}
                    placement="bottomRight"
                >
                    <Button type='ghost' shape='circle' size='large' icon={<UserOutlined />} />
                </Dropdown>
            </Space>
        </>
    );
}
