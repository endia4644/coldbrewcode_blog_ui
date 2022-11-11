import { BarsOutlined, CoffeeOutlined } from '@ant-design/icons';
import { Layout, Menu } from 'antd';
import { Link, Route, Routes } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import Sider from 'antd/lib/layout/Sider';
import React from 'react';
import Home from './home/container/Home';
import Blog from './blog/main/container/BlogMain';
import 'antd/dist/antd.min.css';
import './common/scss/common.scss';


export default function App() {
  const location = useLocation();
  const siderKey = location.pathname;
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
    getItem(<Link to={"/"}>About</Link>, '/', <CoffeeOutlined />),
    getItem(<Link to={"/blog"}>Blog</Link>, '/blog', <BarsOutlined />),
  ];
  return (
    <>
      <Layout style={{ height: "100%", minHeight: '100vh' }} className="ant-layout-has-sider">
        <Sider
          className='fix-menu'
          theme="light"
          width={160}
          style={{ paddingTop: 40, zIndex: 2, height: '100%' }}
          breakpoint="xxl"
          defaultCollapsed={true}
          collapsedWidth="0"
        >
          <div className="logo" />
          <Menu
            defaultSelectedKeys={[siderKey]}
            mode="inline"
            theme="light"
            style={{ height: "100%" }}
            items={items}
          />
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
