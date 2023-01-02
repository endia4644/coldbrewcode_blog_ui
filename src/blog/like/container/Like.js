import { Col, Divider, Row, Typography } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { actions as authActions } from "../../auth/state";
import { Content, Header } from "antd/lib/layout/layout";
import Settings from "../../main/components/Settings";
import Post from "../components/Post";
import "./../scss/like.scss";

export default function Like() {
  const dispatch = useDispatch();

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
      <Content className="post-wrap main-content">
        <Typography.Title level={3}>관심글</Typography.Title>
        <Divider />
        <Post />
      </Content>
    </>
  );
}