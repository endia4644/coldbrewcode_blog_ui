import { HeartFilled } from "@ant-design/icons";
import { Badge, Button } from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { FetchStatus } from "../../../common/constant";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";
import { actions as common } from "../../../common/state";

export default function Topbar({ id, likeCount, likeYsno }) {
  const dispatch = useDispatch();
  const divRef = useRef(null);
  const [activeLike, setActiveLike] = useState(likeYsno);
  const [activeLikeCount, setActiveLikeCount] = useState(likeCount);
  const { fetchStatus: addStatus } = useFetchInfo(Types.FetchAddPostLike, id);
  const { fetchStatus: removeStatus } = useFetchInfo(
    Types.FetchRemovePostLike,
    id
  );

  useEffect(() => {
    if (addStatus === FetchStatus.Fail) {
      setActiveLike(!activeLike);
      setActiveLikeCount(activeLikeCount - 1);
      dispatch(
        common.setFetchStatus({
          actionType: Types.FetchAddPostLike,
          fetchKey: id,
          status: FetchStatus.Delete,
        })
      );
    }
  }, [
    addStatus,
    id,
    setActiveLikeCount,
    activeLikeCount,
    setActiveLike,
    activeLike,
    dispatch,
  ]);

  useEffect(() => {
    if (removeStatus === FetchStatus.Fail) {
      setActiveLike(!activeLike);
      setActiveLikeCount(activeLikeCount + 1);
      dispatch(
        common.setFetchStatus({
          actionType: Types.FetchRemovePostLike,
          fetchKey: id,
          status: FetchStatus.Delete,
        })
      );
    }
  }, [
    removeStatus,
    id,
    setActiveLikeCount,
    activeLikeCount,
    setActiveLike,
    activeLike,
    dispatch,
  ]);

  function likeClick() {
    setActiveLike(!activeLike);
    if (activeLike) {
      dispatch(actions.fetchRemovePostLike(id));
      setActiveLikeCount(activeLikeCount - 1);
    } else {
      dispatch(actions.fetchAddPostLike(id));
      setActiveLikeCount(activeLikeCount + 1);
    }
  }
  return (
    <>
      <Badge count={activeLikeCount} className="main-topbar">
        <motion.div
          ref={divRef}
          className="box"
          whileTap={{
            scale: 1.2,
            transition: { type: "spring", stiffness: 400, damping: 10 },
          }}
        >
          <Button
            className={`like-btn ${activeLike ? "like-btn-active" : ""}`}
            style={{
              width: "3rem",
              height: "2rem",
              background: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 12,
              border: "1px solid #d9d9d9",
              marginBottom: "0.5rem",
            }}
            onClick={likeClick}
            icon={
              <HeartFilled style={{ fontSize: "1rem", color: "#d9d9d9" }} />
            }
          ></Button>
        </motion.div>
      </Badge>
    </>
  );
}
