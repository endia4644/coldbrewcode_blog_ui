import { Divider, Typography } from "antd";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { actions as commonActions } from "../../../common/state";
import { actions, Types } from "../state";
import Post from "../components/Post";
import "./../scss/like.scss";
import useNeedLogin from "../../../common/hook/useNeedLogin";
import { FetchType } from "../../../common/constant";

export default function Like() {
  // 로그인필수화면 - 로그인 여부 검사
  useNeedLogin();
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      // 언마운트 시 임시글 조회 액션 상태초기화
      dispatch(commonActions.setFetchStatus({
        actionType: Types.FetchAllPost,
        fetchType: FetchType.Delete,
      }));
      dispatch(actions.setValue('post', []));
    }
  }, [dispatch])

  return (
    <>
      <Typography.Title level={3}>관심글</Typography.Title>
      <Divider />
      <Post />
    </>
  );
}