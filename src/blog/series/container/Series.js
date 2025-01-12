import { BackTop, Button, Col, Divider, Row, Typography, Modal, message } from "antd";
import { Content, Header } from "antd/lib/layout/layout";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import Settings from "../../main/components/Settings";
import { actions, Types } from "./../state";
import { actions as authActions } from "../../auth/state";
import "../scss/series.scss";
import { CloseCircleOutlined, DownOutlined } from "@ant-design/icons";
import { UpArrowIcon } from "../../../common/components/Icon";
import { AuthStatus, FetchStatus } from "../../../common/constant";
import SeriesList from "../components/SeriesList";
import useFetchInfo from "../../../common/hook/useFetchInfo";
const { confirm } = Modal;

export default function Series() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const order = useSelector(state => state.series.order);
    const series = useSelector(state => state.series.series);
    const posts = useSelector(state => state.series.posts);
    const status = useSelector((state) => state.auth.status);
    const user = useSelector((state) => state.auth.user);
    const [isUpdate, setIsUpdate] = useState(false);
    const [list, setList] = useState([]);
    const fetchSeriesInfo = useFetchInfo(Types.FetchSeries, id);
    const fetchUpdateInfo = useFetchInfo(Types.FetchUpdateSeries, id);
    const fetchDeleteInfo = useFetchInfo(Types.FetchDeleteSeries, id);

    /**
     * 초기화 시 시리즈 조회
     */
    useEffect(() => {
        dispatch(actions.fetchSeries({ id }))
    }, [dispatch])

    /**
     * 로그아웃 처리
     */
    function logout() {
        dispatch(authActions.fetchLogout());
    }

    /**
     * 수정된 리스트 저장 함수
     */
    function onsSave() {
        dispatch(actions.fetchUpdateSeries({ id, posts: list }))
    }

    /* 자식 객체에게 list Set 함수 전달
        -> 자식은 수정한 리스트를 list Set함수를 호출해서 반환
        -> 수정되서 반환된 리스트는 부모에서 리스트 업데이트 사가함수 호출 시 사용
    */
    const getList = (list) => {
        setList(list);
    }

    /* 정렬 기준 변경 */
    const buttonChange = (order) => {
        const newPost = [...posts];
        dispatch(actions.setValue("posts", newPost.reverse()));
        dispatch(actions.setValue("order", order));
    }

    /**
     * 시리즈 삭제 함수 - 시리즈 자체를 삭제하는 함수
     */
    const showConfirm = () => {
        confirm({
            title: '시리즈를 삭제하시겠습니까?',
            icon: <CloseCircleOutlined />,
            okText: "삭제",
            cancelText: "취소",
            onOk() {
                dispatch(actions.fetchDeleteSeries({ id }));
            },
        });
    };

    /**
     * 메시지 그루핑 키
     */
    const key = "seriesDelete";

    /**
     * 업데이트 성공 시 수정버튼 활성화 제거
     */
    useEffect(() => {
        if (fetchUpdateInfo.fetchStatus === FetchStatus.Success) setIsUpdate(false);
    }, [fetchUpdateInfo])

    /**
     * 삭제 시 메시지 제어
     */
    useEffect(() => {
        if (fetchDeleteInfo.fetchStatus === FetchStatus.Success) {
            message.success({
                content: "삭제가 완료되었습니다",
                key,
                duration: 2,
            });
            setTimeout(() => {
                navigate('/blog')
            }, 1000);
        } else if (fetchDeleteInfo.fetchStatus === FetchStatus.Request) {
            message.loading({
                content: "처리중",
                key,
            });
        }
    }, [fetchDeleteInfo])

    /**
     * 없는 시리즈 검색 시 블로그 메인으로 강제 이동
     */
    useLayoutEffect(() => {
        if (fetchSeriesInfo.fetchStatus !== FetchStatus.Request && !series) {
            navigate("/blog");
        }
    }, [fetchSeriesInfo, navigate, series]);

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
                    <Button icon={<DownOutlined className={order} />} className={'button-type-round button-color-normal series-order'} onClick={() => { buttonChange(order == 'desc' ? 'asc' : 'desc') }}>{order == 'desc' ? '내림차순' : '오름차순'}</Button>
                </Row>
                {status === AuthStatus.Login && user?.userType === "admin" && (
                    <Row style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
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
                                {posts.length !== 0 &&
                                    <Button
                                        className="button-type-round button-color-white"
                                        style={{ marginRight: 5 }}
                                        onClick={() => {
                                            setIsUpdate(!isUpdate);
                                        }}
                                    >
                                        수정
                                    </Button>
                                }
                                <Button
                                    className="button-type-round button-color-white"
                                    style={{ marginRight: 5 }}
                                    onClick={() => {
                                        showConfirm();
                                    }}
                                >
                                    삭제
                                </Button>
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