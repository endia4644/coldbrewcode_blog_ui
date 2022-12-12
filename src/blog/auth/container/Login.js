import React from "react";
import { Form, Input, Button, Typography, Row, Card } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { actions } from "../state";
import useBlockLoginUser from "../hook/useBlockLoginUser";
import AuthLayout from "../component/AuthLayout";
import "../scss/auth.scss";
import { useNavigate } from "react-router-dom";
import useQuery from "../hook/useQuery";

export default function Login() {
  let query = useQuery();
  useBlockLoginUser(query.get("returnUrl"));
  const dispatch = useDispatch();
  function onFinish({ email, password }) {
    dispatch(actions.fetchLogin(email, password));
  }

  const navigate = useNavigate();
  return (
    <AuthLayout onFinish={onFinish}>
      <Card
        style={{
          width: "20rem",
        }}
        cover={
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
        // eslint-disable-next-line no-sparse-arrays
        actions={[
          <Typography.Text>아이디 찾기</Typography.Text>,
          <Typography.Text>비밀번호 찾기</Typography.Text>,
          <Typography.Text onClick={() => navigate("/blog/signup")}>
            회원가입
          </Typography.Text>,
        ]}
      >
        <Form.Item
          name="email"
          rules={[{ required: true, message: "이메일을 입력하세요." }]}
        >
          <Input autoFocus prefix={<UserOutlined />} placeholder="email" />
        </Form.Item>
        <Form.Item
          name="password"
          className="input-style-round"
          rules={[{ required: true, message: "비밀번호를 입력하세요." }]}
        >
          <Input
            prefix={<LockOutlined />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item>
          <Row justify="center" style={{ paddingTop: 10 }}>
            <Button
              className="button-type-round button-color-reverse"
              htmlType="submit"
              style={{
                width: "100%",
                fontSize: 20,
                height: 48,
                border: "1px solid #f8f9fb",
              }}
            >
              로그인
            </Button>
          </Row>
        </Form.Item>
      </Card>
    </AuthLayout>
  );
}
