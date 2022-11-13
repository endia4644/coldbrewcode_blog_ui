import { BackTop, Col, Divider, Row, Space, Tabs } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import Settings from "../component/Settings";
import SideBar from "../component/SideBar";
import TopBar from "../component/TopBar";
import UserInfo from "./UserInfo";
import "../scss/Main.scss";
import Post from "../component/Post";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../state";
import Series from "../component/Series";
import { UpArrowIcon } from "../../../common/component/Icon";

export default function Main() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchAllPost());
    dispatch(actions.fetchAllSeries());
    dispatch(actions.fetchAllHashtag());
  }, [dispatch]);

  const hashtag = useSelector(state => state.main.hashtag);
  const activeKey = useSelector(state => state.main.activeKey);
  const tabPaneItems = [{
    label: '글',
    key: 'post',
    children: (<Post />)
  },
  {
    label: '시리즈',
    key: 'series',
    children: (<Series />)
  }]
  /* 메인탭 제어함수 */
  const onTabClick = (target) => {
    dispatch(actions.setValue('activeKey', target));
  }
  return (
    <>
      <Header className="site-layout-background main-header fix-menu">
        <Row justify="end">
          <Col>
            <Settings logout={() => { }} />
          </Col>
        </Row>
      </Header>
      <Content className="main-content">
        <Row justify='start' style={{ marginTop: 100, paddingLeft: 30 }}>
          <Col>
            <UserInfo />
          </Col>
        </Row>
        <Divider />
        <Row justify='center'>
          <Col>
            <SideBar hashtag={hashtag} />
          </Col>
        </Row>
        <TopBar hashtag={hashtag} />
        <Row justify='center' style={{ marginTop: 100 }}>
          <Col className="width-full">
            <Tabs className="main-tabs" size="large" onTabClick={onTabClick} animated centered activeKey={activeKey} defaultActiveKey="1" items={tabPaneItems} />
          </Col>
        </Row>
      </Content>
      <BackTop>
        <div>
          <UpArrowIcon />
        </div>
      </BackTop>
    </>
  )
};