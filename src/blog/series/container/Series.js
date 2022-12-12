import { Button, Col, Divider, Row, Typography } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import Settings from "../../main/components/Settings";
import { actions as authActions } from "../../auth/state";
import "../scss/series.scss";
import { DownOutlined, UpOutlined } from "@ant-design/icons";

export default function Series() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [order, setOrder] = useState(false);
  
    function logout() {
      dispatch(authActions.fetchLogout());
    }
  return (
    <>
        <Header className="site-layout-background main-header fix-menu">
            <Row justify="end">
                <Col>
                <Settings logout={logout} />
                </Col>
            </Row>
        </Header>
        <Content className="series-wrap main-content">
            <Row>
                <Typography.Title
                className="series-title"
                level={4}
                >
                시리즈
                </Typography.Title>
            </Row>
            <Row>
                <Typography.Title
                className="series-name"
                style={{ marginBottom: 0 }}
                >
                시리즈{id}
                </Typography.Title>
            </Row>
            <Divider className="series-line" />
            <Row style={{ display: 'flex', justifyContent: 'flex-end'}}>
                <Button icon={<DownOutlined className={ order ? 'desc' : 'asc'} />} className={'button-type-round button-color-normal series-order'} onClick={() => {setOrder(!order)}}>{order ? '오름차순' : '내림차순'}</Button>
            </Row>
        </Content>
    </>
    )
}