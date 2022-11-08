import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, Divider, Row, Typography } from "antd";
import React from "react";

export default function Blog() {
  return (
    <>
      <Avatar
        size={{ xs: 84, sm: 84, md: 84, lg: 96, xl: 128, xxl: 128 }}
        icon={<UserOutlined />}
      />
      <Typography.Text className="main-name" style={{ paddingLeft: 10 }}>Endia</Typography.Text>
    </>
  )
};