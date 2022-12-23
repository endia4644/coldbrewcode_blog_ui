import { BackTop, Button, Col, Divider, Row, Typography } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Settings from "../../main/components/Settings";
import { actions, Types } from "./../state";
import { actions as authActions } from "../../auth/state";
import "../scss/series.scss";
import { DownOutlined } from "@ant-design/icons";
import { UpArrowIcon } from "../../../common/components/Icon";
import { AuthStatus, FetchStatus } from "../../../common/constant";
import SeriesList from "../components/SeriesList";
import useFetchInfo from "../../../common/hook/useFetchInfo";

export default function Series() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [order, setOrder] = useState(false);
    const series = useSelector(state => state.series.series);
    const posts = useSelector(state => state.series.posts);
    const status = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.user);
    const [isUpdate, setIsUpdate] = useState(false);
    const [list, setList] = useState([]);
    const fetchInfo = useFetchInfo(Types.FetchUpdateSeries);

    function logout() {
        dispatch(authActions.fetchLogout());
    }

    function onsSave() {
        dispatch(actions.fetchUpdateSeries({ id, posts: list }))
    }

    useEffect(() => {
        dispatch(actions.fetchSeries({ id }))
    }, [dispatch])

    const getList = (list) => {
        setList(list);
    }

    useEffect(() => {
        if (fetchInfo.fetchStatus === FetchStatus.Success) setIsUpdate(false);
    }, [fetchInfo])


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
                {status === AuthStatus.Login && user?.userType === "admin" && (
                    <Row style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                        {posts?.length !== 0 &&
                            <>
                                {isUpdate &&
                                    <>
                                        <Button
                                            className="button-type-round button-color-white"
                                            style={{ marginRight: 5 }}
                                            onClick={() => {
                                                setIsUpdate(!isUpdate);
                                            }}
                                        >
                                            취소
                                        </Button>
                                        <Button
                                            className="button-type-round button-color-white"
                                            style={{ marginRight: 5 }}
                                            onClick={() => {
                                                onsSave();
                                            }}
                                        >
                                            적용
                                        </Button>
                                    </>
                                }
                                {!isUpdate &&
                                    <>
                                        <Button
                                            className="button-type-round button-color-white"
                                            style={{ marginRight: 5 }}
                                            onClick={() => {
                                                setIsUpdate(!isUpdate);
                                            }}
                                        >
                                            수정
                                        </Button>
                                        <Button
                                            className="button-type-round button-color-white"
                                            style={{ marginRight: 5 }}
                                            onClick={() => { }}
                                        >
                                            삭제
                                        </Button>
                                    </>
                                }
                            </>
                        }
                    </Row>
                )}
                <Row style={{ marginTop: 30 }}>
                    <SeriesList posts={posts} isUpdate={isUpdate} getList={getList} />
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