import { HeartFilled } from "@ant-design/icons";
import { Affix, Badge, Button, Col, Row } from "antd";
import { motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { FetchStatus } from "../../../common/constant";
import { actions, Types } from "../state";
import { actions as common } from "../../../common/state";
import useFetchInfo from "../../../common/hook/useFetchInfo";

export default function SideBar({ id, likeCount, likeYsno }) {
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
      <Affix className="main-sidebar">
        <Row
          className="main-side"
          style={{ position: "absolute", left: "-35.5rem" }}
        >
          <Col>
            <div
              className="post-content-sidebar"
              style={{ width: 84, borderRadius: 12 }}
            >
              <Badge count={activeLikeCount}>
                <motion.div
                  ref={divRef}
                  className="box"
                  whileTap={{
                    scale: 1.2,
                    transition: { type: "spring", stiffness: 400, damping: 10 },
                  }}
                >
                  <Button
                    className={`like-btn ${
                      activeLike ? "like-btn-active" : ""
                    }`}
                    style={{
                      width: "4rem",
                      height: "4rem",
                      background: "white",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: 12,
                      border: "1px solid #d9d9d9",
                    }}
                    onClick={likeClick}
                    icon={
                      <HeartFilled
                        style={{ fontSize: "2rem", color: "#d9d9d9" }}
                      />
                    }
                  ></Button>
                </motion.div>
              </Badge>
            </div>
          </Col>
        </Row>
      </Affix>
    </>
  );
}
