import React, { useEffect, useLayoutEffect, useRef } from "react";
import {
  Input,
  Form,
  Typography,
  Row,
  Col,
  Button,
  Tooltip,
  Space,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { actions, Types } from "../state";
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  LockOutlined,
} from "@ant-design/icons";
import useBlockLoginUser from "../hook/useBlockLoginUser";
import useBlockLNotEmail from "../hook/useBlockNotEmail";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { FetchStatus } from "../../../common/constant";

export default function Register() {
  useBlockLoginUser();
  useBlockLNotEmail();
  const { id } = useParams();
  const { fetchStatus } = useFetchInfo(Types.FetchSignup);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.fetchGetEmail(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (fetchStatus === FetchStatus.Success) {
      navigate('/blog/login')
    }
  }, [fetchStatus])

  useLayoutEffect(() => {
    emailRef.current.input.value = email;
  });

  const navigate = useNavigate();
  const passwordRef = useRef(null);
  const email = useSelector((state) => state.auth.email);
  const onFinish = (values) => {
    dispatch(
      actions.fetchSignup({
        nickName: values.별명,
        password: values.비밀번호,
        introduce: values.소개,
        email: email,
      })
    );
  };

  const emailRef = useRef(null);

  const goBlog = () => {
    navigate("/blog");
  };

  const validateNickName = (input, value) => {
    const regex = /^[a-zA-Z가-힣]{2,10}$/g;
    if (!value) {
      return Promise.reject(new Error(`${input.field}을 입력해주세요!`));
    } else if (!regex.test(value)) {
      return Promise.reject(new Error("한영 2~10자 이내로 입력해주세요!"));
    } else {
      return Promise.resolve();
    }
  };

  const validatePwd = (input, value) => {
    const regex =
      /^(?=.*[a-zA-z])(?=.*[0-9])(?=.*[$`~!@$!%*#^?&\\(\\)\-_=+]).{8,16}$/g;
    if (!value) {
      return Promise.reject(new Error(`${input.field}을 입력해주세요!`));
    } else if (!regex.test(value)) {
      return Promise.reject(
        new Error("영문으로 시작하고 8~16자 이내로 입력해주세요!")
      );
    } else {
      return Promise.resolve();
    }
  };

  const validatePwdC = (input, value) => {
    if (!value) {
      return Promise.reject(new Error(`${input.field}을 입력해주세요!`));
    } else if (value !== passwordRef?.current?.input?.value) {
      return Promise.reject(
        new Error("입력한 비밀번호와 같은지 확인해주세요!")
      );
    } else {
      return Promise.resolve();
    }
  };

  const [form] = Form.useForm();

  return (
    <>
      <Row
        className="register-wrap"
        justify="center"
        style={{ marginTop: 100 }}
      >
        <Col>
          <Typography.Title>환영합니다!</Typography.Title>
          <Typography.Title level={5} style={{ opacity: 0.5, marginTop: 5 }}>
            기본 회원 정보를 등록해주세요.
          </Typography.Title>
        </Col>
      </Row>
      <Row justify="center" style={{ marginTop: 20 }}>
        <Col style={{ minWidth: 285 }}>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Form.Item
              required
              label="별명"
              name="별명"
              rules={[
                {
                  validator: validateNickName,
                },
              ]}
            >
              <Input placeholder="별명을 입력하세요" allowClear />
            </Form.Item>
            <Form.Item label="이메일" name="이메일" required>
              <Input ref={emailRef} addonAfter={<LockOutlined />} disabled />
            </Form.Item>
            <Tooltip
              trigger={["hover"]}
              title={"8~16자리의 영문,숫자,특수문자를 한개 이상씩 사용해주세요"}
              placement="topLeft"
              color={"#634426"}
              overlayInnerStyle={{
                borderRadius: 4,
                color: "#d8b48b",
                fontWeight: 700,
              }}
              overlayClassName="register-tooltip"
            >
              <Form.Item
                label="비밀번호"
                name="비밀번호"
                required
                rules={[
                  {
                    validator: validatePwd,
                  },
                ]}
              >
                <Input.Password
                  ref={passwordRef}
                  placeholder="비밀번호를 입력하세요"
                  allowClear
                  iconRender={(visible) =>
                    visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                  }
                />
              </Form.Item>
            </Tooltip>
            <Form.Item
              label="비밀번호 확인"
              name="비밀번호 확인"
              required
              rules={[
                {
                  validator: validatePwdC,
                },
              ]}
            >
              <Input.Password
                placeholder="비밀번호를 입력하세요"
                allowClear
                iconRender={(visible) =>
                  visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                }
              />
            </Form.Item>
            <Form.Item label="한 줄 소개" name="소개">
              <Input placeholder="당신을 한 줄로 소개해보세요" allowClear />
            </Form.Item>
            <Form.Item
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <Space>
                <Button
                  className="button-border-hide button-type-round"
                  onClick={goBlog}
                >
                  취소
                </Button>
                <Button
                  className="button-type-round button-color-normal"
                  htmlType="submit"
                >
                  가입
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
}
