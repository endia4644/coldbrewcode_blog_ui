import { BarsOutlined, CoffeeOutlined, GithubOutlined, TwitterOutlined } from '@ant-design/icons';
import { Layout, Menu, Tag } from 'antd';
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
          className='fix-menu'
          theme="light"
          style={{ paddingTop: 40, zIndex: 2, height: '100%' }}
          breakpoint="lg"
          collapsedWidth="0"
        >
          <div className="logo" />
          <Menu
            defaultSelectedKeys={['1']}
            mode="inline"
            theme="light"
            style={{ height: "100%" }}
            items={items}
          />
          <div style={{ width: 95, paddingLeft: 24, paddingBottom: 20, borderBottom: '1px solid gray' }}>

          </div>
        </Sider>
        <Layout className="site-layout-background" style={{ minWidth: 420, width: '100%' }}>
          <Routes>
            <Route path="/" element={<Home />} />-
            <Route path="/blog" element={<Blog />} />
          </Routes>
        </Layout>
      </Layout>
    </>
  );
}
