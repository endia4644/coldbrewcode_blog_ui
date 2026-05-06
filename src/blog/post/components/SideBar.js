import { HeartFilled } from "@ant-design/icons";
import { Affix, Badge, Button, Col, Row } from "antd";
import { motion } from "framer-motion";
import React, { useRef } from "react";

export default function SideBar({ id, activeLike, activeLikeCount, onLikeClick }) {
  const divRef = useRef(null);

  return (
    <>
      <Affix className="main-sidebar">
        <Row
          className="main-side"
          style={{ position: "absolute", left: "-35.5rem", top: '18rem' }}
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
                    className={`like-btn ${activeLike ? "like-btn-active" : ""}`}
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
                    onClick={onLikeClick}
                    icon={
                      <HeartFilled
                        style={{ fontSize: "2rem", color: "#d9d9d9" }}
                      />
                    }
                  />
                </motion.div>
              </Badge>
            </div>
          </Col>
        </Row>
      </Affix>
    </>
  );
}
