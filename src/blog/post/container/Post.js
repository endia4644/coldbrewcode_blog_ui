import { Col, Divider, Row, Space, Typography } from "antd";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { actions } from "../state";
import { actions as authActions } from "../../auth/state";
import { Content, Header } from "antd/lib/layout/layout";
import Settings from "../../main/components/Settings";

import "../scss/post.scss";
import { elapsedTime } from "../../../common/util/util";
import Hashtag from "../components/Hashtag";
import SideBar from "../components/SideBar";

export default function Post() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const post = useSelector((state) => state.post.post);

  function logout() {
    dispatch(authActions.fetchLogout());
  }

  useEffect(() => {
    dispatch(actions.fetchGetPost(id));
  }, [dispatch, id]);
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
        <Row>
          <Typography.Title className="post-name" style={{ marginBottom: 0 }}>
            {post?.postName}
          </Typography.Title>
        </Row>
        <Row style={{ marginTop: "2rem" }}>
          <Space
            split={<Divider type="vertical" />}
            style={{ paddingLeft: 5, opacity: 0.8 }}
            className="post-information"
          >
            <Typography.Title level={5} style={{ fontWeight: 600 }}>
              {post?.User?.nickName}
            </Typography.Title>
            <Typography.Title level={5} style={{ fontWeight: 500 }}>
              {elapsedTime(post?.createdAt)}
            </Typography.Title>
          </Space>
        </Row>
        <Row style={{ marginTop: "1rem" }}>
          {post?.Hashtags && <Hashtag hashtags={post?.Hashtags} />}
        </Row>
        <Divider />
        <Row style={{ marginTop: "4rem" }}>
          {post?.Hashtags && (
            <div
              className="post-content"
              dangerouslySetInnerHTML={{ __html: post?.postContent }}
            ></div>
          )}
        </Row>
        <Row justify="center">
          <Col>
            <SideBar id={id} />
          </Col>
        </Row>
      </Content>
    </>
  );
}
