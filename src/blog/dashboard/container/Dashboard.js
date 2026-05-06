import { FireOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { Col, Radio, Row, Tabs } from "antd";
import React, { useEffect } from "react";
import Post from "../components/Post";
import { FetchType } from "../../../common/constant";
import { useDispatch, useSelector } from "react-redux";
import { actions, Types } from "../state";
import { actions as commonActions } from "../../../common/state";
import "../scss/Dashboard.scss";

const TAB_MAP = { trend: "trending", recently: "latest" };

export default function Dashboard() {
  const dispatch = useDispatch();
  const activeKey = useSelector((state) => state.dashboard.activeKey);
  const trendingPeriod = useSelector((state) => state.dashboard.trendingPeriod);

  useEffect(() => {
    /* Post는 화면진입 할 때마다 초기화 */
    dispatch(actions.setValue({ key: "post", value: [] }));
    dispatch(
      commonActions.setFetchStatus({
        actionType: Types.FetchAllPost,
        fetchType: FetchType.Delete,
      })
    );
  }, [dispatch]);

  const resetAndFetch = ({ tab, period }) => {
    dispatch(actions.setValue({ key: "post", value: [] }));
    dispatch(commonActions.setFetchStatus({ actionType: Types.FetchAllPost, fetchType: FetchType.Delete }));
    dispatch(actions.fetchAllPost({ post: [], totalCount: 0, tab, period }));
  };

  const onTabClick = (target) => {
    dispatch(actions.setValue({ key: "activeKey", value: target }));
    resetAndFetch({ tab: TAB_MAP[target], period: trendingPeriod });
  };

  const onPeriodChange = (e) => {
    const newPeriod = e.target.value;
    dispatch(actions.setValue({ key: "trendingPeriod", value: newPeriod }));
    resetAndFetch({ tab: TAB_MAP[activeKey], period: newPeriod });
  };

  const tabPaneItems = [
    {
      label: <><FireOutlined style={{ margin: '4px' }} />트렌딩</>,
      key: "trend",
      children: <Post />,
    },
    {
      label: <><FieldTimeOutlined style={{ margin: '4px' }} />최신</>,
      key: "recently",
      children: <Post />,
    },
  ];

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
              defaultActiveKey="trend"
              items={tabPaneItems}
              tabBarExtraContent={
                activeKey === "trend" && (
                  <Radio.Group
                    value={trendingPeriod}
                    onChange={onPeriodChange}
                    buttonStyle="solid"
                    size="small"
                    className="period-filter"
                    style={{ marginRight: 16 }}
                  >
                    <Radio.Button value="day">오늘</Radio.Button>
                    <Radio.Button value="week">이번 주</Radio.Button>
                    <Radio.Button value="month">이번 달</Radio.Button>
                  </Radio.Group>
                )
              }
          />
        </Col>
      </Row>
    </>
  );
}
