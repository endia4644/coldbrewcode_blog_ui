import { Col, Divider, Row, Tabs } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React, { useEffect } from "react";
import Settings from "../component/Settings";
import SideBar from "../component/SideBar";
import TopBar from "../component/TopBar";
import UserInfo from "./UserInfo";
import "../scss/Main.scss";
import Post from "../component/Post";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../state";
import Series from "../component/Series";
// import Series from "../component/Series";

export default function Blog() {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(actions.fetchAllPost());
    dispatch(actions.fetchAllSeries());
    dispatch(actions.fetchAllHashtag());
  }, [dispatch]);

  const post = useSelector(state => state.main.post);
  const series = useSelector(state => state.main.series);
  const hashtag = useSelector(state => state.main.hashtag);
  const tabPaneItems = [{
    label: '글',
    key: 'tabpane-1',
    children: (<Post post={post} />)
  },
  {
    label: '시리즈',
    key: 'tabpane-2',
    children: (<Series series={series} />)
  }]
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
            <Tabs className="main-tabs" size="large" animated centered defaultActiveKey="1" items={tabPaneItems} />
          </Col>
        </Row>
      </Content>
    </>
  )
};