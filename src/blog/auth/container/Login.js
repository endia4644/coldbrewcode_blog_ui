import React from "react";
import { Form, Input, Button } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actions } from "../state";
import useBlockLoginUser from "../hook/useBlockLoginUser";
import AuthLayout from "../component/AuthLayout";

export default function Login() {
  useBlockLoginUser();
  const dispatch = useDispatch();
  function onFinish({ email, password }) {
    dispatch(actions.fetchLogin(email, password));
  }
  return (
    <AuthLayout onFinish={onFinish}>
      <Form.Item
        name="email"
        rules={[{ required: true, message: "이메일을 입력하세요." }]}
      >
        <Input autoFocus prefix={<UserOutlined />} placeholder="email" />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[{ required: true, message: "비밀번호를 입력하세요." }]}
      >
        <Input
          prefix={<LockOutlined />}
          type="password"
          placeholder="Password"
        />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit" style={{ width: "100%" }}>
          Log in
        </Button>
        <Link to="/signup">회원가입</Link>
      </Form.Item>
    </AuthLayout>
  );
}
