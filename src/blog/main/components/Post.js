import { Button, Col, List, Typography } from "antd";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";
import { API_HOST, FetchStatus } from "../../../common/constant";
import defaultImg from "./../../../common/images/beans.svg";
import { createActionBar } from "../../../common/util/actionBar";
import { createImgErrorHandler } from "../../../common/util/imgErrorHandler";
import { ReactComponent as LoadingIcon } from "./../../../common/images/loading.svg";

export default function Post({nickname = null}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const post = useSelector((state) => state.main.post?.[nickname]);
  const hashtagCurrent = useSelector((state) => state.main.hashtagCurrent?.[nickname]);
  const searchCurrent = useSelector((state) => state.main.searchCurrent?.[nickname]);

  const { fetchStatus, isFetching, isSlow, nextPage, totalCount } = useFetchInfo(
    Types.FetchAllPost, nickname
  );

  // 액션바 생성함수 호출
  const actionBar = createActionBar();

  // 이미지 오류 핸들러 호출
  const handleImgError = createImgErrorHandler({ defaultImg });

  const postRef = useRef(post);
  const fetchStatusRef = useRef(fetchStatus);
  const totalCountRef = useRef(totalCount);
  const hashtagCurrentRef = useRef(hashtagCurrent);
  const searchCurrentRef = useRef(searchCurrent);
  postRef.current = post;
  fetchStatusRef.current = fetchStatus;
  totalCountRef.current = totalCount;
  hashtagCurrentRef.current = hashtagCurrent;
  searchCurrentRef.current = searchCurrent;

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (
            entry.isIntersecting &&
            (fetchStatusRef.current === undefined || fetchStatusRef.current === FetchStatus.Success)
        ) {
          dispatch(
              actions.fetchAllPost({
                post: postRef.current,
                totalCount: totalCountRef.current,
                hashtag: hashtagCurrentRef.current,
                search: searchCurrentRef.current,
                nickname,
              })
          );
        }
      });
    });

    observer.observe(targetRef.current);

    return () => observer.disconnect();
  }, [nickname]);
  return (
    <>
      {nextPage >= 1 && (
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
              dataSource={post}
              renderItem={(item) => (
                <>
                  <List.Item
                      className="main-list-item"
                      style={{ paddingTop: 30 }}
                      key={`post_${item.id}`}
                      actions={actionBar({ item, type: "default" })}
                  >
                    <div className="thumbnail-wrappper">
                      <div className="thumbnail">
                        <img
                            onClick={() => navigate(`/blog/@${item.User.nickName}/post/${item?.id}`)}
                            style={{ cursor: "pointer", visibility: 'hidden' }}
                            alt="logo"
                            // 이미지를 가져올 때 postThumbnail 값이 없을 경우 의미없는 404 에러 발생 방지
                            src={`${
                                item?.postThumbnail &&
                                item?.postThumbnail !== "null"
                                    ? `${API_HOST}/${item?.postThumbnail}`
                                    : defaultImg
                            }`}
                            onLoad={(e) => { e.target.style.visibility = ''; }}
                            onError={handleImgError}
                        />
                      </div>
                    </div>
                    <Typography.Title>
                      <Link to={`/blog/@${item.User.nickName}/post/${item?.id}`}>{item.postName}</Link>
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
