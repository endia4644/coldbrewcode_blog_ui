import { BookOutlined, DeleteOutlined, FieldTimeOutlined, HeartFilled, HeartOutlined, LockOutlined, MessageOutlined } from "@ant-design/icons";
import React from "react";
import { elapsedTime } from "./util";
import { Button, Space } from "antd";

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

/**
 * 
 * @param {object} param,
 * @param {object} param.item           // 액션바에 사용될 정보
 * @param {string} param.type           // 어떤 액션을 추가할지에 대한 타입  
 * @param {string} param.tempShowModal  // type이 temp일 경우 추가 필요 함수
 * @returns 
 */
export const createActionBar = () => {
  return function ({ item, type = 'default', tempShowModal = null }) {
    const array = [];
    if (type === 'default') {
      array.push(<IconText
        icon={FieldTimeOutlined}
        text={elapsedTime(item.createdAt)}
        key="list-vertical-star-o"
      />)
      array.push(<IconText
        icon={item?.likeYsno ? HeartFilled : HeartOutlined}
        text={item?.likeCount}
        key="list-vertical-like-o"
      />)
      array.push(<IconText
        icon={MessageOutlined}
        text={item.commentCount ?? 0}
        key="list-vertical-message"
      />)
      if (item.permission === "private") {
        array.push(<IconText
          icon={LockOutlined}
          text="비공개"
          key="list-vertical-message"
        />)
      }
    } else if (type === 'temp') {
      array.push(<IconText
        icon={FieldTimeOutlined}
        text={elapsedTime(item.createdAt)}
        key="list-vertical-star-o"
      />)
      if (item.permission === "private") {
        array.push(<IconText
          icon={LockOutlined}
          text="비공개"
          key="list-vertical-message"
        />)
      }
      array.push(<IconText
        icon={DeleteOutlined}
        text={<Button onClick={() => tempShowModal(item.id)} className="button-type-round button-color-white">삭제</Button>}
        key="list-vertical-star-o"
      />)
    } else if (type === 'series') {
      array.push(<IconText
        icon={FieldTimeOutlined}
        text={elapsedTime(item.createdAt)}
        key="list-vertical-star-o"
      />)
      array.push(<IconText
        icon={BookOutlined}
        text={`${item.postCount}개의 포스트`}
        key="list-vertical-like-o"
      />)
    }
    return array;
  }
}