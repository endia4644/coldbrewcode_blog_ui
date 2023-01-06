import { Button, Col, Divider, Row, Typography } from "antd";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions as authActions } from "../../auth/state";
import { Content, Header } from "antd/lib/layout/layout";
import Settings from "../../main/components/Settings";
import "./../scss/setting.scss";
import useNeedLogin from "../../../common/hook/useNeedLogin";
import TopName from "../components/TopName";
import BottomName from "../components/BottomName";
import UserAvatar from "../components/UserAvatar";


export default function Setting() {
  useNeedLogin();
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
      <Content className="setting-wrap main-content">
        <Row justify="center">
          <UserAvatar />
          <TopName />
        </Row>
        <BottomName />
        <Divider />
        <Row justify="center" style={{ width: '100%' }} className="box-flex-start">
          <Col style={{ marginRight: 30 }}>
            <Typography.Title level={4} style={{ minWidth: 160 }}>이메일 주소</Typography.Title>
          </Col>
          <Col>
            <Typography.Text>이메일</Typography.Text>
          </Col>
        </Row>
        <Divider />
        <Row justify="center" style={{ width: '100%' }} className="box-flex-start">
          <Col style={{ marginRight: 30 }}>
            <Typography.Title level={4} style={{ minWidth: 160 }}>이메일 수신설정</Typography.Title>
          </Col>
          <Col>
            <Typography.Text>이메일</Typography.Text>
          </Col>
        </Row>

        <Divider />
        <Row justify="center" style={{ width: '100%' }} className="box-flex-start">
          <Col style={{ marginRight: 30 }}>
            <Typography.Title level={4} style={{ minWidth: 160 }}>회원 탈퇴</Typography.Title>
          </Col>
          <Col>
            <Button className="button-type-round button-color-red">회원 탈퇴</Button>
          </Col>
        </Row>
      </Content>
    </>
  );
}