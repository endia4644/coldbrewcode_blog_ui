import { BookOutlined, FieldTimeOutlined } from "@ant-design/icons";
import { List, Space, Typography } from "antd";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";
import { elapsedTime } from "../../../common/util/util.js";
import { FetchStatus } from "../../../common/constant";

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

export default function Series() {
  const series = useSelector((state) => state.main.series);
  const targetRef = useRef(null);
  const dispatch = useDispatch();
  const { fetchStatus, totalCount } = useFetchInfo(Types.FetchAllSeries);
  useEffect(() => {
    let observer;
    if (targetRef.current) {
      observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (fetchStatus === undefined || fetchStatus === FetchStatus.Success)) {
            dispatch(
              actions.fetchAllSeries({
                series,
                totalCount,
              })
            );
          }
        });
      });
      observer.observe(targetRef.current);
    }
    return () => observer && observer.disconnect();
  }, [dispatch, fetchStatus, series, totalCount]);
  return (
    <>
      <List
        className="main-list"
        grid={{
          xs: 1,
          sm: 1,
          md: 1,
          lg: 2,
          xl: 2,
          xxl: 2,
        }}
        itemLayout="vertical"
        size="large"
        dataSource={series}
        renderItem={(item) => (
          <List.Item
            className="main-list-item"
            style={{ paddingTop: 30 }}
            key={`series_${item.id}`}
            actions={[
              <IconText
                icon={BookOutlined}
                text={`${item.postCount}개의 포스트`}
                key="list-vertical-like-o"
              />,
              <IconText
                icon={FieldTimeOutlined}
                text={elapsedTime(item.createdAt)}
                key="list-vertical-star-o"
              />,
            ]}
          >
            <img
              style={{ paddingBottom: 20 }}
              width={"100%"}
              alt="logo"
              src="https://gw.alipayobjects.com/zos/rmsportal/mqaQswcyDLcXyDKnZfES.png"
            />
            <Typography.Title>
              <Link to={`/blog/series/${item.id}`}>{item.seriesName}</Link>
            </Typography.Title>
          </List.Item>
        )}
      />
      <div
        className="listPost"
        style={{ width: "100%", height: 10 }}
        ref={targetRef}
      />
    </>
  );
}
