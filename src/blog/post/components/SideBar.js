import { HeartFilled, HeartOutlined } from "@ant-design/icons";
import {
  Affix,
  Avatar,
  Badge,
  Button,
  Col,
  Divider,
  Row,
  Tabs,
  Typography,
} from "antd";
import { motion } from "framer-motion";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../state";

export default function SideBar({ id }) {
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
      <Affix className="main-sidebar">
        <Row
          className="main-side"
          style={{ position: "absolute", left: "-35.5rem" }}
        >
          <Col>
            <div
              className="post-content-sidebar"
              style={{ width: 84, borderRadius: 64 }}
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
                      borderRadius: 40,
                      border: "1px solid #d9d9d9",
                    }}
                    onClick={likeClick}
                    icon={
                      <HeartFilled
                        style={{ fontSize: "2.5rem", color: "#d9d9d9" }}
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
