import {Col, Divider, Row, Tabs} from "antd";
import React, { useEffect } from "react";
import Post from "../components/Post";
import Series from "../components/Series";
import { FetchType } from "../../../common/constant";
import { useDispatch, useSelector } from "react-redux";
import { actions, Types } from "../state";
import { actions as commonActions } from "../../../common/state";
import "../scss/Main.scss";
import UserInfo from "../../main/components/UserInfo";
import SideBar from "../../main/components/SideBar";
import Topbar from "../../main/components/TopBar";
import {useParams} from "react-router-dom";

export default function Main() {
  const { nickname } = useParams();
  const dispatch = useDispatch();
  useEffect(() => {
    /* 화면진입 할 때마다 초기화 */
    dispatch(actions.setValue({key: "sideActiveKey", value: "ALL", fetchKey: nickname}));
    dispatch(actions.setValue({key: "activeKey", value: "post", fetchKey: nickname}));
    dispatch(actions.setValue({key: "post", value: [], fetchKey: nickname}));
    dispatch(
      commonActions.setFetchStatus({
        actionType: Types.FetchAllPost,
        fetchType: FetchType.Delete,
      })
    );
    dispatch(actions.setValue({key: "series", value: [], fetchKey: nickname}));
    dispatch(
      commonActions.setFetchStatus({
        actionType: Types.FetchAllSeries,
        fetchType: FetchType.Delete,
      })
    );
    dispatch(actions.fetchAllHashtag({nickname: nickname}));
  }, [dispatch, nickname]);
  const hashtag = useSelector((state) => state.main.hashtag[nickname] || []);
  const activeKey = useSelector((state) => state.main.activeKey[nickname]);
  const tabPaneItems = [
    {
      label: "글",
      key: "post",
      children: <Post nickname={nickname} />,
    },
    {
      label: "시리즈",
      key: "series",
      children: <Series nickname={nickname} />,
    },
  ];
  /* 메인탭 제어함수 */
  const onTabClick = (target) => {
    dispatch(actions.setValue({key: "activeKey", value: target, fetchKey: nickname}));
  };
  return (
    <>
      <Row justify="start" style={{ marginTop: 100, paddingLeft: 30 }}>
        <Col>
          <UserInfo />
        </Col>
      </Row>
      <Divider />
      <Row justify="center">
        <Col>
          <SideBar hashtag={hashtag} nickname={nickname} />
        </Col>
      </Row>
      <Topbar hashtag={hashtag} nickname={nickname} />
      <Row justify="center" style={{ marginTop: 100 }}>
        <Col className="width-full">
          <Tabs
              className="main-tabs"
              size="large"
              onTabClick={onTabClick}
              animated
              centered
              activeKey={activeKey}
              defaultActiveKey="1"
              items={tabPaneItems}
          />
        </Col>
      </Row>
    </>
  );
}
