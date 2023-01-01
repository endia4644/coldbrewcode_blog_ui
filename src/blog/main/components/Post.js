import {
  FieldTimeOutlined,
  HeartFilled,
  HeartOutlined,
  LockOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Button, Col, List, Space, Typography } from "antd";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";
import { elapsedTime } from "../../../common/util/util.js";
import { API_HOST, FetchStatus } from "../../../common/constant";
import defaultImg from "./../../../common/images/beans.svg";
const { Title } = Typography;

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const handleImgError = (e) => {
  e.target.src = defaultImg;
};

export default function Post() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const post = useSelector((state) => state.main.post);
  const hashtagCurrent = useSelector((state) => state.main.hashtagCurrent);
  const searchCurrent = useSelector((state) => state.main.searchCurrent);
  const { fetchStatus, totalCount } = useFetchInfo(Types.FetchAllPost);
  const { totalCount: searchCount } = useFetchInfo(Types.FetchSearchPost);

  useEffect(() => {
    let observer;
    if (targetRef.current) {
      observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (fetchStatus === undefined || fetchStatus === FetchStatus.Success)) {
            dispatch(
              actions.fetchAllPost(
                post,
                totalCount,
                hashtagCurrent,
                searchCurrent
              )
            );
          }
        });
      });
      observer.observe(targetRef.current);
    }
    return () => observer && observer.disconnect();
  }, [dispatch, post, totalCount, hashtagCurrent, searchCurrent]);
  return (
    <>
      {searchCurrent && (
        <>
          <Space style={{ marginLeft: 30 }}>
            <Title level={5}>총</Title>
            <Title level={3} style={{ color: "#d8b48b" }}>
              {searchCount}
            </Title>
            <Title level={5}>개의 포스트를 찾았습니다.</Title>
          </Space>
        </>
      )}
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
        dataSource={post}
        renderItem={(item) => (
          <>
            <List.Item
              className="main-list-item"
              style={{ paddingTop: 30 }}
              key={`post_${item.id}`}
              actions={[
                <IconText
                  icon={FieldTimeOutlined}
                  text={elapsedTime(item.createdAt)}
                  key="list-vertical-star-o"
                />,
                <IconText
                  icon={item?.likeYsno ? HeartFilled : HeartOutlined}
                  text={item?.likeCount}
                  key="list-vertical-like-o"
                />,
                <IconText
                  icon={MessageOutlined}
                  text={item.commentCount ?? 0}
                  key="list-vertical-message"
                />,
                item.permission === "private" && (
                  <IconText
                    icon={LockOutlined}
                    text="비공개"
                    key="list-vertical-message"
                  />
                ),
              ]}
            >
              <img
                onClick={() => navigate(`/blog/post/${item?.id}`)}
                style={{ paddingBottom: 20, cursor: 'pointer' }}
                width={"100%"}
                height={223}
                alt="logo"
                src={`${API_HOST}/${item?.postThumbnail}`}
                onError={handleImgError}
              />
              <Typography.Title>
                <Link to={`/blog/post/${item.id}`}>{item.postName}</Link>
              </Typography.Title>
              <List.Item.Meta />
              <Typography.Paragraph
                style={{ minHeight: 66 }}
                ellipsis={{
                  rows: 3,
                  expandable: false,
                }}
              >
                {item.postDescription}
              </Typography.Paragraph>
              {item.Hashtags && (
                <Col>
                  {item.Hashtags.map((item, i) => (
                    <Button
                      key={`button_${i}`}
                      className="tag-button"
                      type="primary"
                      shape="round"
                      style={{ marginTop: 10, marginRight: 10 }}
                    >
                      {item.hashtagName}
                    </Button>
                  ))}
                </Col>
              )}
            </List.Item>
          </>
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
