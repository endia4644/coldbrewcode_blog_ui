import { List, Typography } from "antd";
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";
import { API_HOST, FetchStatus } from "../../../common/constant";
import defaultImg from "./../../../common/images/beans.svg";
import { createActionBar } from "../../../common/util/actionBar";
import { createImgErrorHandler } from "../../../common/util/imgErrorHandler";
import Lottie from "lottie-react";
// @ts-ignore
import loadingLottie from "../../../assets/lottie/loading.json";

export default function Series({nickname = null}) {
  const navigate = useNavigate();
  const series = useSelector((state) => state.main.series[nickname] || []);
  const targetRef = useRef(null);
  const dispatch = useDispatch();

  const { fetchStatus, isFetching, isSlow, nextPage, totalCount } = useFetchInfo(Types.FetchAllSeries, nickname);

  // 액션바 생성함수 호출
  const actionBar = createActionBar();

  // 이미지 오류 핸들러 호출
  const handleImgError = createImgErrorHandler({ defaultImg });

  const seriesRef = useRef(series);
  const fetchStatusRef = useRef(fetchStatus);
  const totalCountRef = useRef(totalCount);
  seriesRef.current = series;
  fetchStatusRef.current = fetchStatus;
  totalCountRef.current = totalCount;

  useEffect(() => {
    if (!targetRef.current) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && (fetchStatusRef.current === undefined || fetchStatusRef.current === FetchStatus.Success)) {
          dispatch(
            actions.fetchAllSeries({
              series: seriesRef.current,
              nickname,
              totalCount: totalCountRef.current,
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
              actions={actionBar({ item, type: "series" })}
            >
              <div className="thumbnail-wrappper">
                <div className="thumbnail">
                  <img
                    onClick={() => navigate(`/blog/series/@${nickname}/post/${item?.id}`)}
                    style={{ cursor: 'pointer', visibility: 'hidden' }}
                    alt="logo"
                    // 이미지를 가져올 때 seriesThumbnail 값이 없을 경우 의미없는 404 에러 발생 방지
                    src={`${item?.seriesThumbnail && item?.seriesThumbnail !== 'null' ? `${API_HOST}/${item?.seriesThumbnail}` : defaultImg}`}
                    onLoad={(e) => { e.target.style.visibility = ''; }}
                    onError={handleImgError}
                  />
                </div>
              </div>
              <Typography.Title>
                <Link to={`/blog/series/@${nickname}/post/${item?.id}`}>{item.seriesName}</Link>
              </Typography.Title>
            </List.Item>
          )}
        />
      )}
      {isSlow && isFetching && (
        <Lottie animationData={loadingLottie} style={{ overflow: 'hidden', opacity: 0.5 }} className="lottie-loader" />
      )}
      <div
        className="listPost"
        style={{ width: "100%", height: 10 }}
        ref={targetRef}
      />
    </>
  );
}
