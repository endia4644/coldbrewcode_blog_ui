import {Avatar, Card, List, Typography} from "antd";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";
import { API_HOST, FetchStatus } from "../../../common/constant";
import defaultImg from "./../../../common/images/beans.svg";
import {IconText} from "../../../common/util/actionBar";
import { createImgErrorHandler } from "../../../common/util/imgErrorHandler";
import { ReactComponent as LoadingIcon } from "./../../../common/images/loading.svg";
import {HeartFilled, HeartOutlined, UserOutlined} from "@ant-design/icons";
import {elapsedTime} from "../../../common/util/util";

export default function Post() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const post = useSelector((state) => state.dashboard.post);
  const { fetchStatus, isFetching, isSlow, totalCount } = useFetchInfo(
    Types.FetchAllPost
  );

  // 이미지 오류 핸들러 호출
  const handleImgError = createImgErrorHandler({ defaultImg });

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (
                entry.isIntersecting &&
                (fetchStatus === undefined || fetchStatus === FetchStatus.Success)
            ) {
              dispatch(
                  actions.fetchAllPost({
                    post,
                    totalCount,
                  })
              );
            }
          });
        },
        {
          // 1. 하단에 200px 정도의 여유 공간을 둡니다.
          // 타겟 요소가 화면 하단으로부터 200px 지점에 도달하면 바로 true가 됩니다.
          rootMargin: '0px 0px 500px 0px',

          // 2. threshold는 0으로 두어 조금이라도 해당 영역(margin 포함)에 걸치면 바로 실행되게 합니다.
          threshold: 0
        }
    );

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [post]);

  return (
    <>
      {post.length > 0 && (
        <>
          <List
              className="dashboard-list"
              grid={{
                xs: 1,
                sm: 1,
                md: 2,
                lg: 2,
                xl: 3,
                xxl: 5,
              }}
              itemLayout="vertical"
              size="large"
              dataSource={post}
              renderItem={(item) => (
                  <>
                    <List.Item
                        className="dashboard-list-item"
                        style={{ paddingTop: 30 }}
                        key={`post_${item.id}`}
                    >
                      <Card
                          cover={
                            <img
                                draggable={false}
                                onClick={() => navigate(`/blog/@${item.User.nickName}/post/${item?.id}`)}
                                style={{ cursor: "pointer" }}
                                alt="logo"
                                // 이미지를 가져올 때 postThumbnail 값이 없을 경우 의미없는 404 에러 발생 방지
                                src={`${
                                    item?.postThumbnail &&
                                    item?.postThumbnail !== "null"
                                        ? `${API_HOST}/${item?.postThumbnail}`
                                        : defaultImg
                                }`}
                                onError={handleImgError}
                            />
                          }
                          actions={[
                            <div className={'userBox'} onClick={() => navigate(`/blog/@${item.User.nickName}`)}>
                              <Avatar src={`${API_HOST}/${item?.User?.profileImg}`} icon={<UserOutlined />} />
                              <Typography style={{ display: 'inline', marginLeft: '10px'}}>By</Typography>
                              <Typography style={{ display: 'inline', marginLeft: '10px'}}>{item?.User?.nickName}</Typography>
                            </div>,
                            <IconText
                                icon={item?.likeYsno ? HeartFilled : HeartOutlined}
                                text={item?.likeCount}
                                key="list-vertical-like-o"
                            />,
                          ]}
                      >
                        <Typography.Title level={4} className={'ellipsis'}>
                          <Link to={`/blog/@${item.User.nickName}/post/${item?.id}`}>{item.postName}</Link>
                        </Typography.Title>
                        <Typography.Paragraph
                            style={{ fontSize: '0.875rem', minHeight: '44px' }}
                            ellipsis={{
                              rows: 2,
                              expandable: false,
                            }}
                        >
                          {item.postDescription}
                        </Typography.Paragraph>
                        <p className={'elapsedTime'}>{elapsedTime(item.createdAt)}</p>
                      </Card>
                    </List.Item>
                  </>
              )}
          />
        </>
      )}
      {(isSlow || isFetching) && (
        <LoadingIcon className={"contentsLoading"} width={250} height={250} />
      )}
      <div
        className="listPost"
        style={{ width: "100%", height: 10 }}
        ref={targetRef}
      />
    </>
  );
}
