import { Col, Divider, Row, Typography } from "antd";
import React from "react";
import { useSelector } from "react-redux";
import "./../scss/setting.scss";
import useNeedLogin from "../../../common/hook/useNeedLogin";
import TopName from "../components/TopName";
import BottomName from "../components/BottomName";
import UserAvatar from "../components/UserAvatar";
import EmailReciveSetting from "../components/EmailReciveSetting";
import SignOut from "../components/SignOut";


export default function Setting() {
  useNeedLogin();
  const user = useSelector(state => state.auth.user);

  return (
    <>
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
          <Typography.Text>{user?.email}</Typography.Text>
        </Col>
      </Row>
      <Divider />
      <Row justify="center" style={{ width: '100%', minWidth: 345 }} className="box-flex-start">
        <Col style={{ marginRight: 30 }}>
          <Typography.Title level={4} style={{ minWidth: 160 }}>이메일 수신설정</Typography.Title>
        </Col>
        <EmailReciveSetting />
      </Row>

      <Divider />
      <Row justify="center" style={{ width: '100%', marginBottom: 50 }} className="box-flex-start">
        <Col style={{ marginRight: 30 }}>
          <Typography.Title level={4} style={{ minWidth: 160 }}>회원 탈퇴</Typography.Title>
        </Col>
        <SignOut />
      </Row>
    </>
  );
}