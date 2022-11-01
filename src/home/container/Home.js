import { Col, Row, Typography } from "antd";
import React from "react";

export default function Home() {
  return (
    <>
      <Row justify="center" align="middle" style={{ minHeight: '60vh' }}>
        <Col>
          <Typography.Title>ColdBrewCode</Typography.Title>
          <Typography.Text>@jungmo</Typography.Text>
          <Typography.Title>One drop at a time</Typography.Title>
        </Col>
      </Row>
    </>
  )
};