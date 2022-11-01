import { BarsOutlined, CoffeeOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Content } from 'antd/lib/layout/layout';
import Sider from 'antd/lib/layout/Sider';
import React from 'react';
import { Link, Route, Routes } from 'react-router-dom';
import Home from './home/container/Home';
import 'antd/dist/antd.min.css';
import './App.scss';
import Blog from './blog/main/container/BlogMain';

export default function App() {
  function getItem(label, key, icon, children, type, link) {
    return {
      key,
      icon,
      children,
      label,
      type,
      link
    };
  }
  const items = [
    getItem(<Link to={"/"}>About</Link>, '1', <CoffeeOutlined />),
    getItem(<Link to={"/blog"}>Blog</Link>, '2', <BarsOutlined />),
  ];
  return (
    <>
      <Layout style={{ height: "100%", minHeight: '100vh' }} className="ant-layout-has-sider">
        <Sider
          theme="light"
          style={{ paddingTop: 40 }}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={broken => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <div className="logo" />
          <Menu
            defaultSelectedKeys={['1']}
            mode="inline"
            theme="light"
            style={{ height: "100%" }}
            items={items}
          />
        </Sider>
        <Layout className="site-layout-background">
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              minHeight: 280,
            }}
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/blog" element={<Blog />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </>
  );
}
