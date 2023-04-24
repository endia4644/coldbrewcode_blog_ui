import { Col, Divider, Row, Typography } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { actions as authActions } from "../../auth/state";
import { actions as commonActions } from "../../../common/state";
import { actions, Types } from "../state";
import { Content, Header } from "antd/lib/layout/layout";
import Settings from "../../main/components/Settings";
import Post from "../components/Post";
import useNeedLogin from "../../../common/hook/useNeedLogin";
import { FetchType } from "../../../common/constant";

export default function Temp() {
  // 로그인필수화면 - 로그인 여부 검사
  useNeedLogin();
  const dispatch = useDispatch();
  /**
   * 로그아웃 처리
   */
  function logout() {
    dispatch(authActions.fetchLogout());
  }

  useEffect(() => {
    return () => {
      // 언마운트 시 임시글 조회 액션 상태초기화
      dispatch(commonActions.setFetchStatus({
        actionType: Types.FetchAllPost,
        fetchType: FetchType.Delete,
      }));
      dispatch(actions.setValue('post', []));
    }
  }, [dispatch])

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
        <Typography.Title level={3}>임시글</Typography.Title>
        <Divider />
        <Post />
      </Content>
    </>
  );
}