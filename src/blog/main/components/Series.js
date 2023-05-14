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

export default function Series() {
  const navigate = useNavigate();
  const series = useSelector((state) => state.main.series);
  const targetRef = useRef(null);
  const dispatch = useDispatch();

  const { fetchStatus, isFetched, isSlow, nextPage, totalCount } = useFetchInfo(Types.FetchAllSeries);

  // 액션바 생성함수 호출
  const actionBar = createActionBar();

  // 이미지 오류 핸들러 호출
  const handleImgError = createImgErrorHandler({ defaultImg });

  useEffect(() => {
    let observer;
    if (targetRef.current) {
      observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          /**
           * 스크롤이 옵저버가 감시하는 지점이 도착했으며 FetchAllSeries action의 상태가
           * undefined 거나 Success 일때만 새로운 리스트를 요청한다.
           * undefined는 첫 요청시에 호출되기 위하여 필요하다.
           * 첫 요청 후 FetchAllSeries action의 상태는 Success로 변경된다.
           */
          if (entry.isIntersecting && (fetchStatus === undefined || fetchStatus === FetchStatus.Success)) {
            // 시리즈 추가 조회
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
      {nextPage >= 1 ?
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
                    onClick={() => navigate(`/blog/series/${item.id}`)}
                    style={{ cursor: 'pointer' }}
                    alt="logo"
                    // 이미지를 가져올 때 seriesThumbnail 값이 없을 경우 의미없는 404 에러 발생 방지
                    src={`${item?.seriesThumbnail && item?.seriesThumbnail !== 'null' ? `${API_HOST}/${item?.seriesThumbnail}` : defaultImg}`}
                    onError={handleImgError}
                  />
                </div>
              </div>
              <Typography.Title>
                <Link to={`/blog/series/${item.id}`}>{item.seriesName}</Link>
              </Typography.Title>
            </List.Item>
          )}
        /> : <Lottie animationData={loadingLottie} style={{ overflow: 'hidden', opacity: 0.5 }} className="lottie-loader"></Lottie>
      }
      {nextPage >= 1 && isSlow && !isFetched ?
        <Lottie animationData={loadingLottie} style={{ overflow: 'hidden', opacity: 0.5 }} className="lottie-loader" /> : ''
      }
      <div
        className="listPost"
        style={{ width: "100%", height: 10 }}
        ref={targetRef}
      />
    </>
  );
}
