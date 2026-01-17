import { BarsOutlined, CoffeeOutlined } from "@ant-design/icons";
import {Input, Layout, Menu} from "antd";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import Sider from "antd/lib/layout/Sider";
import Home from "./home/container/Home";
import Blog from "./blog/main/container/Main";
import Write from "./blog/write/container/Write";
import Login from "./blog/auth/container/Login";
import Register from "./blog/auth/container/Register";
import Post from "./blog/post/container/Post";
import Signup from "./blog/auth/container/Signup";

import React, {useEffect, useMemo, useRef, useState} from "react";
import { useLocation } from "react-router-dom";
import {actions as authActions} from "./blog/auth/state";
import {useDispatch, useSelector} from "react-redux";

import "antd/dist/antd.min.css";
import "./common/scss/common.scss";
import NotFound from "./common/container/NotFound";
import Series from "./blog/series/container/Series";
import Like from "./blog/like/container/Like";
import Temp from "./blog/temp/container/Temp";
import Setting from "./blog/setting/container/Setting";
import Dashboard from "./blog/dashboard/container/Dashboard";
import {AnimatePresence, motion} from "framer-motion";
import {actions as commonActions} from "./common/state";
import {actions as searchActions, Types as commonTypes} from "./blog/search/state";
import {BLOG, FetchType, HOME} from "./common/constant";
import CustomLayout from "./common/components/CustomLayout";
import Search from "./blog/search/container/Search";
import {makeUrlWithParams} from "./common/util/util";

export default function App() {
  const dispatch = useDispatch();
  const searchFlag = useSelector(state => state.common.searchFlag);
  const searchRef = useRef(null);
  const buttonRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const location = useLocation();
  const pathname = location.pathname;

  // @ 포함 여부 확인
  const hasNickname = pathname.includes('@');

  // 닉네임만 추출 (공백 제거 등 추가 처리 가능)
  const nickname = hasNickname ? pathname.split('@')[1] : null;

  /**
   * 검색 Input Blur 핸들링
   */
  const onInputBlur = () => {
    dispatch(commonActions.setValue({key: "searchFlag", value: false}));
    setSearchText('');
  }

  /**
   * 입력받은 검색어로 게시글 검색 ( 제목,소개,본문에서 검색함 )
   */
  const handleOnClick = () => {
    // 검색어가 있을 경우만 검색
    if (searchText) {
      window.scrollTo(0, 0);
      dispatch(searchActions.setValue({key: "post", value: []}));
      // 검색 결과를 위해 기존 post 목록을 비움
      dispatch(commonActions.setFetchStatus({
        actionType: commonTypes.FetchSearchPost,
        fetchType: FetchType.Delete,
      }))
      // 게시글 검색
      dispatch(
          searchActions.fetchSearchPost({ nickname: nickname, search: searchText })
      );
      if(pathname !== "/blog/search") {
        navigate(makeUrlWithParams('/blog/search', {nickname: nickname}));
      }
      // 현재 화면이 blog일 경우 처리
      dispatch(commonActions.setValue({ key: "searchFlag", value: false }));
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

  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();
  });
  const items = useMemo(
      () => [
        {
          key: HOME,
          icon: <CoffeeOutlined />,
          label: <Link to={`${HOME}`}>About</Link>,
        },
        {
          key: BLOG,
          icon: <BarsOutlined />,
          label: <Link to={`${BLOG}`}>Blog</Link>,
        },
      ],
      []
  );

  useEffect(() => {
    dispatch(authActions.fetchUser());
  }, [dispatch]);

  useEffect(() => {
    const bodyEl = document.getElementsByTagName("body")[0];
    const loadingEl = document.getElementById("init-loading");
    bodyEl.removeChild(loadingEl);
  }, []);

  return (
    <>
      <Layout
        style={{ height: "100vh", minHeight: "600px" }}
        className="ant-layout-has-sider"
      >
        <Sider
          className="fix-menu"
          theme="light"
          width={160}
          style={{ paddingTop: 40, zIndex: 2, height: "100%" }}
          breakpoint="xxl"
          defaultCollapsed={true}
          collapsedWidth="0"
        >
          <div className="logo" />
          <Menu
              selectedKeys={[location.pathname]}
              mode="inline"
              theme="light"
              style={{ height: "100%" }}
              items={items}
          />
        </Sider>
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
                    <svg style={{ width: 24, height: 24, position: 'relative'}} viewBox="0 0 24 24"><path fill="#666666" d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />
                    </svg>
                  </button>
                </div>
              </>
          )}
        </AnimatePresence>
        <Layout
          className="site-layout-background"
          style={{ minWidth: 375, width: "100%" }}
        >
          <Routes>
            <Route path="/" element={<Home />} />

            <Route path="/blog" element={<CustomLayout classNames={'dashboard-content'}/>}>
              <Route index element={<Dashboard />} />
              <Route path="/blog/search" element={<Search />} />
              <Route path="/blog/login" element={<Login />} />
              <Route path="/blog/signup" element={<Signup />} />
              <Route path="/blog/register/:id" element={<Register />} />
              <Route path="/blog/write" element={<Write />} />
              <Route path="/blog/write/:id" element={<Write />} />
            </Route>

            <Route path="/blog" element={<CustomLayout classNames={'main-content setting-wrap'}/>}>
              <Route path="/blog/user/setting" element={<Setting />} />
            </Route>

            <Route path="/blog/@:nickname" element={<CustomLayout classNames={'main-content'}/>}>
              <Route index element={<Blog />} />
            </Route>

            <Route path="/blog/@:nickname" element={<CustomLayout classNames={'main-content post-wrap'}/>}>
              <Route path="/blog/@:nickname/post/:id" element={<Post />} />
              <Route path="/blog/@:nickname/series/:id" element={<Series />} />
              <Route path="/blog/@:nickname/like/post" element={<Like />} />
              <Route path="/blog/@:nickname/temp/post" element={<Temp />} />
            </Route>

            <Route path="*" element={<NotFound />} />

          </Routes>
        </Layout>
      </Layout>
    </>
  );
}
