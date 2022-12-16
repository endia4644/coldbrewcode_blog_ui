import { BackTop, Button, Col, Divider, Row, Typography } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Settings from "../../main/components/Settings";
import { actions } from "./../state";
import { actions as authActions } from "../../auth/state";
import "../scss/series.scss";
import { DownOutlined } from "@ant-design/icons";
import Posts from "../components/Posts";
import { UpArrowIcon } from "../../../common/components/Icon";

export default function Series() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [order, setOrder] = useState(false);
    const series = useSelector(state => state.series.series);

    function logout() {
        dispatch(authActions.fetchLogout());
    }

    useEffect(() => {
        dispatch(actions.fetchSeries({ id }))
    }, [dispatch])

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
                        {series?.seriesName}
                    </Typography.Title>
                </Row>
                <Divider className="series-line" />
                <Row style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button icon={<DownOutlined className={order ? 'desc' : 'asc'} />} className={'button-type-round button-color-normal series-order'} onClick={() => { setOrder(!order) }}>{order ? '오름차순' : '내림차순'}</Button>
                </Row>
                <Row>
                    <Posts posts={series?.Posts} />
                </Row>
            </Content>
            <BackTop>
                <div>
                    <UpArrowIcon />
                </div>
            </BackTop>
        </>
    )
}