import { Col, Divider, Row, Tabs, Typography } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React from "react";
import Settings from "../component/Settings";
import "../scss/Main.scss";
import UserInfo from "./UserInfo";

export default function Blog() {
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
        <Row justify='center' style={{ marginTop: 100 }}>
          <Col>
            <UserInfo />
          </Col>
        </Row>
        <Divider />
        <Row justify='center' style={{ marginTop: 100 }}>
          <Col className="width-full">
            <Tabs className="main-tabs" size="large" animated centered defaultActiveKey="1">
              <Tabs.TabPane tab="글" key="1">
                Content of Tab Pane 1
              </Tabs.TabPane>
              <Tabs.TabPane tab="시리즈" key="2">
                Content of Tab Pane 2
              </Tabs.TabPane>
            </Tabs>
          </Col>
        </Row>
      </Content>
    </>
  )
};