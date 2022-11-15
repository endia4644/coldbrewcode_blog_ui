import { ArrowLeftOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Form, Row, Space, Typography, Upload } from "antd";
import { Content, Footer } from "antd/lib/layout/layout";
import { motion } from "framer-motion";
import React from "react";
import { ImageIcon } from "../../../common/component/Icon";

export default function WriteSetting({ setLevel }) {

  return (
    <>
      <motion.div
        className="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        <motion.div layoutId={`item-motion-1`}>
          <div className="content">
            <Content className="main-content" style={{ height: 'calc(100% - 52px)', display: "flex", alignItems: "center" }}>
              <Row className="sub-content">
                <Col>
                  <Typography.Title>포스트 미리보기</Typography.Title>
                  <Form>
                    <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={() => { }} noStyle>
                      <Upload.Dragger name="files" action="/upload.do">
                        <p className="ant-upload-drag-icon">
                          <ImageIcon style={{ height: 170, display: 'block' }} />
                          <Button
                            className='button-type-round button-color-normal button-size-large'
                          >
                            출간하기
                          </Button>
                        </p>
                      </Upload.Dragger>
                    </Form.Item>
                  </Form>
                </Col>
                <div className="vertical-line" />
                <div>2</div>
              </Row>
            </Content>
            <Footer className='main-footer'>
              <Row>
                <Col flex='auto'>
                  <Button
                    style={{ fontWeight: 700 }}
                    className='button-border-hide button-type-round'
                    icon={<ArrowLeftOutlined />}
                    onClick={() => {
                      setLevel(0);
                    }}
                  >
                    나가기

                  </Button>
                </Col>
                <Col flex='168px'>
                  <Space>
                    <Button
                      style={{ fontWeight: 700 }}
                      className='button-border-hide button-type-round'
                    >
                      임시저장
                    </Button>
                    <Button
                      className='button-type-round button-color-reverse'
                    >
                      출간하기
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Footer>
          </div>
        </motion.div>{" "}
      </motion.div>
    </>
  )
};