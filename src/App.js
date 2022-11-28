import { BarsOutlined, CoffeeOutlined } from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { Link, Route, Routes } from "react-router-dom";
import { useLocation } from "react-router-dom";
import Sider from "antd/lib/layout/Sider";
import React, { useEffect } from "react";
import Home from "./home/container/Home";
import Blog from "./blog/main/container/Main";
import Write from "./blog/write/container/Write";
import "antd/dist/antd.min.css";
import "./common/scss/common.scss";
import Login from "./blog/auth/container/Login";
import { actions as authActions } from "./blog/auth/state";
import { useDispatch } from "react-redux";
import Signup from "./blog/auth/container/Signup";
import Register from "./blog/auth/container/Register";

export default function App() {
  function setScreenSize() {
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }
  useEffect(() => {
    setScreenSize();
  });
  const location = useLocation();
  const siderKey = location.pathname;
  function getItem(label, key, icon, children, type, link) {
    return {
      key,
      icon,
      children,
      label,
      type,
      link,
    };
  }
  const items = [
    getItem(<Link to={"/"}>About</Link>, "/", <CoffeeOutlined />),
    getItem(<Link to={"/blog"}>Blog</Link>, "/blog", <BarsOutlined />),
  ];

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(authActions.fetchUser());
  }, [dispatch]);

  useEffect(() => {
    const bodyEl = document.getElementsByTagName("body")[0];
    const loadingEl = document.getElementById("init-loading");
    bodyEl.removeChild(loadingEl);
  }, []);

  return (
    <>
      <Layout
        style={{ height: "100vh", minHeight: "600px" }}
        className="ant-layout-has-sider"
      >
        <Sider
          className="fix-menu"
          theme="light"
          width={160}
          style={{ paddingTop: 40, zIndex: 2, height: "100%" }}
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
        <Layout
          className="site-layout-background"
          style={{ minWidth: 375, width: "100%" }}
        >
          <Routes>
            <Route path="/" element={<Home />} />-
            <Route path="/blog" element={<Blog />} />
            <Route path="/blog/write" element={<Write />} />
            <Route path="/blog/write/:id" element={<Write />} />
            <Route path="/blog/login" element={<Login />} />
            <Route path="/blog/signup" element={<Signup />} />
            <Route path="/blog/register/:id" element={<Register />} />
          </Routes>
        </Layout>
      </Layout>
    </>
  );
}
