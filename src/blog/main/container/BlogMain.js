import { LikeOutlined, MessageOutlined, StarOutlined } from "@ant-design/icons";
import { Button, Col, Divider, List, Row, Space, Tabs, Typography } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import Settings from "../component/Settings";
import SideBar from "../component/SideBar";
import TopBar from "../component/TopBar";
import UserInfo from "./UserInfo";
import "../scss/Main.scss";

export default function Blog() {
  const [size, setSize] = useState('large');
  const data = Array.from({
    length: 6,
  }).map((_, i) => ({
    href: 'https://ant.design',
    key: `post_${i}`,
    title: `자료구조 Stack`,
    postNo: 1,
    description:
      'Stack 자료구조에 대해 배워봅니다.',
    tags: ['자료구조', 'Stack', '자료구조', 'Stack', '자료구조', 'Stack'],
    content:
      '정렬 알고리즘에 입문할 때 예시로 쓰일 정도로 쉽고 기초적인 정렬 알고리즘이라고 할 수 있다...',
  }));
  const IconText = ({ icon, text }) => (
    <Space>
      {React.createElement(icon)}
      {text}
    </Space>
  );
  const tabPaneItems = [{
    label: '글',
    key: 'tabpane-1',
    children: (
      <List
        className="main-list"
        grid={{
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }
        }
        itemLayout="vertical"
        size="large"
        dataSource={data}
        renderItem={(item) => (
          <List.Item
            className="main-list-item"
            style={{ paddingTop: 30 }}
            key={item.key}
            actions={[
              <IconText icon={StarOutlined} text="156" key="list-vertical-star-o" />,
              <IconText icon={LikeOutlined} text="156" key="list-vertical-like-o" />,
              <IconText icon={MessageOutlined} text="2" key="list-vertical-message" />,
            ]}
          >
            <img
              style={{ paddingBottom: 20 }}
              width={'100%'}
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
            <Typography.Title>
              <Link to={`/${item.postNo}`}>{item.title}</Link>
            </Typography.Title>
            <List.Item.Meta
              description={item.description}
            />
            {item.content}
            <Col>
              {item.tags.map((item, i) => (
                <Button key={`button_${i}`} className="tag-button" type="primary" shape="round" style={{ marginTop: 10, marginRight: 10 }}>{item}</Button>
              ))}
            </Col>
          </List.Item>
        )}
      />
    )
  },
  {
    label: '시리즈',
    key: 'tabpane-2'
  }]
  return (
    <>
      <Header className="site-layout-background main-header fix-menu">
        <Row justify="end">
          <Col>
            <Settings logout={() => { }} />
          </Col>
        </Row>
      </Header>
      <Content className="main-content">
        <Row justify='start' style={{ marginTop: 100, paddingLeft: 30 }}>
          <Col>
            <UserInfo />
          </Col>
        </Row>
        <Divider />
        <Row justify='center'>
          <Col>
            <SideBar />
          </Col>
        </Row>
        <TopBar />
        <Row justify='center' style={{ marginTop: 100 }}>
          <Col className="width-full">
            <Tabs className="main-tabs" size="large" animated centered defaultActiveKey="1" items={tabPaneItems} />
          </Col>
        </Row>
      </Content>
    </>
  )
};