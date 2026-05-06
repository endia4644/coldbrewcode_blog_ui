import { HeartFilled } from "@ant-design/icons";
import { Badge, Button } from "antd";
import { motion } from "framer-motion";
import React, { useRef } from "react";

export default function Topbar({ activeLike, activeLikeCount, onLikeClick }) {
  const divRef = useRef(null);

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
            onClick={onLikeClick}
            icon={
              <HeartFilled style={{ fontSize: "1rem", color: "#d9d9d9" }} />
            }
          />
        </motion.div>
      </Badge>
    </>
  );
}
