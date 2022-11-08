import { Col, Row, Typography } from "antd";
import { Content } from "antd/lib/layout/layout";
import React from "react";

export default function Home() {
  return (
    <>
      <Content
        style={{
          margin: '24px 16px',
          padding: 24,
          minHeight: 280,
        }}
      >
        <Row justify="center" align="middle" style={{ minHeight: '60vh' }}>
          <Col>
            <Typography.Title>ColdBrewCode</Typography.Title>
            <Typography.Text>@jungmo</Typography.Text>
            <Typography.Title>One drop at a time</Typography.Title>
          </Col>
        </Row>
      </Content>
    </>
  )
};