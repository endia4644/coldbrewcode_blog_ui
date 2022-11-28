import React from "react";
import { Col, Row, Typography, Form } from "antd";

/**
 *
 * @param {object} param
 * @param {() => void} param.onFinish
 * @param {import('react').ReactNode} param.children
 */
export default function AuthLayout({ children, onFinish }) {
  return (
    <>
      <Row justify="center">
        <Col>
          <Form
            initialValues={{ remember: true }}
            style={{ marginTop: 150 }}
            onFinish={onFinish}
          >
            {children}
          </Form>
        </Col>
      </Row>
    </>
  );
}
