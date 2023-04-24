import {
  FieldTimeOutlined,
  HeartFilled,
  HeartOutlined,
  LockOutlined,
  MessageOutlined,
} from "@ant-design/icons";
import { Button, Divider, Space, Typography } from "antd";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { API_HOST } from "../../../common/constant.js";
import { elapsedTime } from "../../../common/util/util.js";
import defaultImg from "./../../../common/images/beans.svg";
import { createImgErrorHandler } from "../../../common/util/imgErrorHandler.js";

/**
 * 
 * @description 아이콘 컴포넌트 생성
 * @param {object} param
 * @param {object} param.icon // 사용할 아이콘 객체
 * @param {object} param.text // 아이콘과 매핑될 문구
 */
const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

export default function SeriesItem({ post, isUpdate, onRemove = null }) {
  const navigate = useNavigate();

  // 이미지 오류 핸들러 호출
  const handleImgError = createImgErrorHandler({ defaultImg });

  return (
    <div style={{ width: '100%', backgroundColor: "white" }} className="series">
      <div className="series-header">
        <div className="text-box" style={{ marginLeft: 50 }}>
          <li>
            <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
              <Typography.Title>
                <Link to={`/blog/post/${post.id}?postType=series`}>{post.postName}</Link>
              </Typography.Title>
              {isUpdate &&
                <Button
                  className="button-type-round button-color-white"
                  style={{ marginRight: 10, marginTop: 10 }}
                  onClick={() => {
                    onRemove(post?.id)
                  }}
                >
                  삭제
                </Button>
              }
            </div>
          </li>
        </div>
      </div>
      <div className="series-body">
        <div className="series-thumnail">
          <img
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(`/blog/post/${post?.id}?postType=series`)}
            alt="logo"
            // 이미지를 가져올 때 postThumbnail 값이 없을 경우 의미없는 404 에러 발생 방지
            src={`${post?.postThumbnail && post?.postThumbnail !== 'null' ? `${API_HOST}/${post?.postThumbnail}` : defaultImg}`}
            onError={handleImgError}
          />
        </div>
        <div className="series-content" style={{ width: '100%', minWidth: 0 }}>
          <Typography.Title
            level={3}
            style={{ minHeight: 66 }}
          >
            {post.postDescription}
          </Typography.Title>
          <div className="series-state">
            <div className="series-state-item">
              <IconText
                icon={FieldTimeOutlined}
                text={elapsedTime(post.createdAt)}
                key="list-vertical-star-o"
              />
            </div>
            <Divider type="vertical" style={{ top: '0.3em' }} />
            <div className="series-state-item">
              <IconText
                icon={post?.likeYsno ? HeartFilled : HeartOutlined}
                text={post?.likeCount ?? 0}
                key="list-vertical-like-o"
              />
            </div>
            <Divider type="vertical" style={{ top: '0.3em' }} />
            <div className="series-state-item">
              <IconText
                icon={MessageOutlined}
                text={post?.commentCount ?? 0}
                key="list-vertical-message"
              />
            </div>

            {post.permission === "private" && (
              <>
                <Divider type="vertical" style={{ top: '0.3em' }} />
                <div className="series-state-item">
                  <IconText
                    icon={LockOutlined}
                    text="비공개"
                    key="list-vertical-message"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
