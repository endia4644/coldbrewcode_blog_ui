import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Menu, Space } from "antd";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_HOST, AuthStatus, FetchStatus } from "../../../common/constant";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { Types as authTypes } from "../../auth/state";
import { actions as mainActions, Types as mainTypes } from "../../main/state";
import { actions as commonActions } from "../../../common/state";

/**
 *
 * @param {object} param
 * @param {() => void} param.logout
 */
export default function Settings({ logout }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();
  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);
  const homeRef = useRef();

  const { fetchStatus: outFetchStatus } = useFetchInfo(authTypes.FetchLogout);

  useEffect(() => {
    /* 로그인 성공 시 메인의 게시글을 초기화 해준다.
      - 미초기화 시 권한에 따른 게시글이 보이지 않고 기존 게시글이 노출
    */
    if (outFetchStatus === FetchStatus.Success) {
      dispatch(mainActions.setValue('post', []));
      dispatch(commonActions.setFetchStatus({
        actionType: mainTypes.FetchAllPost,
        status: FetchStatus.Delete
      }))
    }
  }, [outFetchStatus])
  const onClickHome = () => {
    // @ts-ignore
    homeRef.current.blur();
    navigate('/blog');
  }

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
  function menuClick({ key }) {
    switch (key) {
      case "1":
        navigate('/blog/temp/post')
        break;
      case "2":
        navigate('/blog/like/post')
        break;
      case "3":
        navigate('/blog/user/setting')
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
          <Button
            ref={homeRef}
            shape="round"
            size="large"
            style={{ padding: '6.4px 10px', border: '1px solid #d9d9d9' }}
            icon={<HomeOutlined />} onClick={onClickHome}
          />
          <Dropdown
            overlayClassName="setting-dropbox"
            overlay={<Menu items={menuItems} onClick={menuClick} />}
            trigger={["click"]}
            placement="bottomRight"
          >
            <Avatar
              style={{ marginBottom: 4, boxShadow: '0px 0px 0px 0px' }}
              size={{ xs: 40, sm: 40, md: 40, lg: 40, xl: 40, xxl: 40 }}
              icon={user?.profileImg ? <img src={`${API_HOST}/${user?.profileImg}`} alt="preview-img" /> : <UserOutlined />}
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
