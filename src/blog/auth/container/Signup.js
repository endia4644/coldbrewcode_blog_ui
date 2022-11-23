import React from "react";
import AuthLayout from "../component/AuthLayout";
import { Input, Button, Form, Row, Card, Typography, Select } from "antd";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { actions } from "../state";
import useBlockLoginUser from "../hook/useBlockLoginUser";

export default function Signup() {
  useBlockLoginUser();
  const dispatch = useDispatch();
  function onFinish({ name }) {
    const email = `${name}${EMAIL_SUFFIX}`;
    dispatch(actions.fetchSignup(email));
  }

  const navigate = useNavigate();

  const selectAfter = <>@</>;
  return (
    <AuthLayout onFinish={onFinish}>
      <Card
        style={{
          width: 350,
        }}
        cover={
          <img
            alt="example"
            src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
          />
        }
        actions={[
          <Typography.Text>아이디 찾기</Typography.Text>,
          <Typography.Text>비밀번호 찾기</Typography.Text>,
          <Typography.Text onClick={() => navigate("/blog/login")}>
            로그인
          </Typography.Text>,
        ]}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: "Please input your email!",
            },
          ]}
        >
          <Input.Group compact style={{ display: "flex" }}>
            <Input autoFocus addonAfter={selectAfter} placeholder="" />
            <Select
              defaultValue="naver.com"
              style={{ width: 120 }}
              options={[
                {
                  value: "naver.com",
                  label: "naver.com",
                },
                {
                  value: "daum.net",
                  label: "daum.net",
                },
                {
                  value: "gmail.com",
                  label: "gmail.com",
                },
                {
                  value: "직접선택",
                  label: "직접선택",
                },
              ]}
            />
          </Input.Group>
        </Form.Item>
        <Form.Item>
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
            인증 메일 받기
          </Button>
        </Form.Item>
      </Card>
    </AuthLayout>
  );
}

const EMAIL_SUFFIX = "@company.com";
