import { FireOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { Col, Row, Tabs } from "antd";
import React, { useEffect } from "react";
import Post from "../components/Post";
import { FetchType } from "../../../common/constant";
import { useDispatch, useSelector } from "react-redux";
import { actions, Types } from "../state";
import { actions as commonActions } from "../../../common/state";
import "../scss/Dashboard.scss";

export default function Dashboard() {
  const dispatch = useDispatch();
  useEffect(() => {
    /* Post는 화면진입 할 때마다 초기화 */
    dispatch(actions.setValue("post", []));
    dispatch(
      commonActions.setFetchStatus({
        actionType: Types.FetchAllPost,
        fetchType: FetchType.Delete,
      })
    );
  }, [dispatch]);
  const activeKey = useSelector((state) => state.dashboard.activeKey);
  const tabPaneItems = [
    {
      label: <>
        <FireOutlined style={{ margin: '4px'}}/>트랜딩
      </>,
      key: "trend",
      children: <Post />,
    },
    {
      label: <>
        <FieldTimeOutlined style={{ margin: '4px'}}/>최신
      </>,
      key: "recently",
      children: <Post />,
    },
  ];
  /* 메인탭 제어함수 */
  const onTabClick = (target) => {
    dispatch(actions.setValue("activeKey", target));
  };

  return (
    <>
      <Row justify="center" style={{ marginTop: 60 }}>
        <Col className="width-full">
          <Tabs
              className="dashboard-tabs"
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
