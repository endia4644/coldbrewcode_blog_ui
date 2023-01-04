import { UserOutlined } from "@ant-design/icons";
import { Button, Dropdown, Menu, Space } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { AuthStatus } from "../../../common/constant";

/**
 *
 * @param {object} param
 * @param {() => void} param.logout
 */
export default function Settings({ logout }) {
  const location = useLocation();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);
  const menuItems = [
    {
      key: "1",
      label: "임시글",
    },
    {
      key: "2",
      label: "관심글",
    },
    {
      key: "3",
      label: "설정",
    },
    {
      key: "4",
      label: "로그아웃",
    },
  ];
  function menuClick({ item, key }) {
    switch (key) {
      case "1":
        navigate('/blog/temp/post')
        break;
      case "2":
        navigate('/blog/like/post')
        break;
      case "3":
        break;
      case "4":
        logout();
        break;
      default:
    }
  }

  return (
    <>
      {status === AuthStatus.Login && (
        <Space>
          {user?.userType === "admin" && (
            <Button
              className="write-button"
              type="ghost"
              shape="round"
              size="large"
            >
              <Link to={"/blog/write"}>글 작성하기</Link>
            </Button>
          )}
          <Dropdown
            overlayClassName="setting-dropbox"
            overlay={<Menu items={menuItems} onClick={menuClick} />}
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
      )}
      {status === AuthStatus.NotLogin && (
        <Space>
          <Button
            className="write-button"
            type="ghost"
            shape="round"
            size="large"
          >
            <Link to={`/blog/login?returnUrl=${location.pathname}`}>로그인</Link>
          </Button>
        </Space>
      )}
    </>
  );
}
