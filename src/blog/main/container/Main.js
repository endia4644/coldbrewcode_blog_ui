import { BackTop, Col, Divider, Row, Tabs } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React, { useEffect } from "react";
import Settings from "../components/Settings";
import SideBar from "../components/SideBar";
import TopBar from "../components/TopBar";
import UserInfo from "../components/UserInfo";
import Post from "../components/Post";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../state";
import { actions as authActions } from "../../auth/state";
import Series from "../components/Series";
import { UpArrowIcon } from "../../../common/components/Icon";
import "../scss/main.scss";

export default function Main() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchAllSeries());
    dispatch(actions.fetchAllHashtag());
  }, [dispatch]);
  const hashtag = useSelector((state) => state.main.hashtag);
  const activeKey = useSelector((state) => state.main.activeKey);
  const tabPaneItems = [
    {
      label: "글",
      key: "post",
      children: <Post />,
    },
    {
      label: "시리즈",
      key: "series",
      children: <Series />,
    },
  ];
  /* 메인탭 제어함수 */
  const onTabClick = (target) => {
    dispatch(actions.setValue("activeKey", target));
  };

  function logout() {
    dispatch(authActions.fetchLogout());
  }

  return (
    <>
      <Header className="site-layout-background main-header fix-menu">
        <Row justify="end">
          <Col>
            <Settings logout={logout} />
          </Col>
        </Row>
      </Header>
      <Content className="main-content">
        <Row justify="start" style={{ marginTop: 100, paddingLeft: 30 }}>
          <Col>
            <UserInfo />
          </Col>
        </Row>
        <Divider />
        <Row justify="center">
          <Col>
            <SideBar hashtag={hashtag} />
          </Col>
        </Row>
        <TopBar hashtag={hashtag} />
        <Row justify="center" style={{ marginTop: 100 }}>
          <Col className="width-full">
            <Tabs
              className="main-tabs"
              size="large"
              onTabClick={onTabClick}
              animated
              centered
              activeKey={activeKey}
              defaultActiveKey="1"
              items={tabPaneItems}
            />
          </Col>
        </Row>
      </Content>
      <BackTop>
        <div>
          <UpArrowIcon />
        </div>
      </BackTop>
    </>
  );
}
