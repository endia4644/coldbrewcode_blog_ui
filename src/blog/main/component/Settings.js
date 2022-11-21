import { SettingFilled, UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Space } from "antd";
import React from "react";
import { Link } from "react-router-dom";

/**
 *
 * @param {object} param
 * @param {() => void} param.logout
 */
export default function Settings({ logout }) {
  return (
    <>
      <Space>
        <Button
          className="write-button"
          type="ghost"
          shape="round"
          size="large"
        >
          <Link to={"/blog/write"}>글 작성하기</Link>
        </Button>
        <Dropdown
          overlayClassName="setting-dropbox"
          overlay={
            <Menu>
              <Menu.Item onClick={logout}>임시글</Menu.Item>
              <Menu.Item onClick={logout}>관심글</Menu.Item>
              <Menu.Item onClick={logout}>설정</Menu.Item>
              <Menu.Item onClick={logout}>로그아웃</Menu.Item>
            </Menu>
          }
          trigger={["click"]}
          placement="bottomRight"
        >
          <Button
            type="ghost"
            shape="circle"
            size="large"
            icon={<UserOutlined />}
          />
        </Dropdown>
      </Space>
    </>
  );
}
