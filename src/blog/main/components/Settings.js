import { HomeOutlined, SearchOutlined, UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Dropdown, Input, Menu, Space } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { API_HOST, AuthStatus, FetchStatus, FetchType } from "../../../common/constant";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types as authTypes } from "../../auth/state";
import { actions as mainActions, Types as mainTypes } from "../../main/state";
import { actions as commonActions } from "../../../common/state";
import { AnimatePresence, motion } from "framer-motion";
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
  const [searchFlag, setSearchFlag] = useState(false);
  const searchRef = useRef(null);
  const buttonRef = useRef(null);
  const [searchText, setSearchText] = useState("");

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
  }, [dispatch, outFetchStatus])
  const onClickHome = () => {
    // @ts-ignore
    homeRef.current.blur();
    navigate('/blog');
  }

  /**
   * 검색 버튼 핸들러
   */
  const onClickSearch = () => {
    setSearchFlag(true);
  }

  /**
   * 검색 Input Blur 핸들링
   */
  const onInputBlur = () => {
    setSearchFlag(false);
    setSearchText('');
  }

  /**
   * 입력받은 검색어로 게시글 검색 ( 제목,소개,본문에서 검색함 )
   */
  const handleOnClick = () => {
    // 검색어가 있을 경우만 검색
    if (searchText) {
      window.scrollTo(0, 0);
      dispatch(actions.setValue("post", []));
      // 검색 결과를 위해 기존 post 목록을 비움
      dispatch(commonActions.setFetchStatus({
        actionType: mainTypes.FetchAllPost,
        fetchType: FetchType.Delete,
      }))
      // 게시글 검색
      dispatch(
        mainActions.fetchAllPost({ search: searchText })
      );
      navigate('/blog');
      // 현재 화면이 blog일 경우 처리
      setSearchFlag(false);
      setSearchText('');
      // 검색버튼의 포커싱을 제거한다.
    }
  };

  /**
   * @description 엔터 이벤트 핸들링
   * @param {*} e 
   */
  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      handleOnClick(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

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
          <Button icon={<SearchOutlined />}
            shape="round"
            size="large"
            style={{ padding: '6.4px 10px', border: '1px solid #d9d9d9' }}
            onClick={onClickSearch}
          />
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
          <Button icon={<SearchOutlined />}
            shape="round"
            size="large"
            style={{ padding: '6.4px 10px', border: '1px solid #d9d9d9' }}
            onClick={onClickSearch}
          />

          <Button
            ref={homeRef}
            shape="round"
            size="large"
            style={{ padding: '6.4px 10px', border: '1px solid #d9d9d9' }}
            icon={<HomeOutlined />} onClick={onClickHome}
          />
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
      <AnimatePresence>
        {searchFlag && (
          <>
            <motion.div
              key="modal"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, transition: { duration: 0.3 } }}
              className="overlay"
            >
            </motion.div>
            <div className="searchBar open">
              <Input
                ref={searchRef}
                id="searchQueryInput"
                type="text"
                name="searchQueryInput"
                placeholder="검색어를 입력하세요"
                value={searchText}
                autoFocus
                onChange={(search) => setSearchText(search.target.value)}
                onPressEnter={handleOnKeyPress}
                onBlur={onInputBlur}
              />
              <button
                ref={buttonRef}
                id="searchQuerySubmit"
                type="submit"
                name="searchQuerySubmit"
                onClick={handleOnClick}
              >
                <svg style={{ width: 24, height: 24, position: 'relative', top: -5 }} viewBox="0 0 24 24"><path fill="#666666" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                </svg>
              </button>
            </div>
          </>
        )
        }
      </AnimatePresence>
    </>
  );
}
