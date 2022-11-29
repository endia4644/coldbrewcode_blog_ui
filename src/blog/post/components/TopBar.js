
import { HeartFilled } from "@ant-design/icons";
import { Badge, Button } from "antd";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";

export default function Topbar({ id }) {
  const dispatch = useDispatch();
  const divRef = useRef(null);
  const [activeLike, setActiveLike] = useState(false);
  const [activeLikeCount, setActiveLikeCount] = useState(5);

  function likeClick() {
    setActiveLike(!activeLike);
    if (activeLike) {
      setActiveLikeCount(activeLikeCount - 1);
    } else {
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
            className={`like-btn ${activeLike ? "like-btn-active" : ""
              }`}
            style={{
              width: "3rem",
              height: "2rem",
              background: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: 12,
              border: "1px solid #d9d9d9",
              marginBottom: '0.5rem'
            }}
            onClick={likeClick}
            icon={
              <HeartFilled
                style={{ fontSize: "1rem", color: "#d9d9d9" }}
              />
            }
          ></Button>
        </motion.div>
      </Badge>
    </>
  );
}
