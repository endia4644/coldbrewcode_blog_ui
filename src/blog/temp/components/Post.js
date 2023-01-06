import {
  DeleteOutlined,
  FieldTimeOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { Button, Col, List, Modal, Space, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";
import { actions as writeActions } from "../../write/state";
import { elapsedTime } from "../../../common/util/util.js";
import { API_HOST, FetchStatus } from "../../../common/constant";
import defaultImg from "./../../../common/images/beans.svg";

const IconText = ({ icon, text }) => (
  <Space>
    {React.createElement(icon)}
    {text}
  </Space>
);

const handleImgError = (e) => {
  e.target.src = defaultImg;
};

export default function Post() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const post = useSelector((state) => state.temp.post);
  const [delTempId, setDelTempId] = useState("");

  const { fetchStatus, totalCount } = useFetchInfo(Types.FetchAllPost);

  function handleOnClick({ id }) {
    dispatch(actions.fetchWritePost({ id }))
    dispatch(writeActions.setValue("postType", "temp"));
    dispatch(writeActions.setValue("tempId", id));
    navigate('/blog/write');
  }

  const [open, setOpen] = useState(false);

  function showModal(id) {
    setDelTempId(id);
    setOpen(true);
  };

  const handleOk = () => {
    dispatch(actions.fetchDeleteTempPost({ id: delTempId, post }))
    setOpen(false);
  };

  const handleCancel = () => {
    setDelTempId("");
    setOpen(false);
  };

  useEffect(() => {
    let observer;
    console.log(targetRef.current)
    if (targetRef.current) {
      observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && (fetchStatus === undefined || fetchStatus === FetchStatus.Success)) {
            dispatch(
              actions.fetchAllPost(
                post,
                totalCount,
              )
            );
          }
        });
      });
      observer.observe(targetRef.current);
    }
    return () => observer && observer.disconnect();
  }, [dispatch, post, totalCount]);
  return (
    <>
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
        dataSource={post}
        renderItem={(item) => (
          <>
            <List.Item
              className="main-list-item"
              style={{ paddingTop: 30 }}
              key={`post_${item.id}`}
              actions={[
                <IconText
                  icon={FieldTimeOutlined}
                  text={elapsedTime(item.createdAt)}
                  key="list-vertical-star-o"
                />,
                item.permission === "private" && (
                  <IconText
                    icon={LockOutlined}
                    text="비공개"
                    key="list-vertical-message"
                  />
                ),
                <IconText
                  icon={DeleteOutlined}
                  text={<Button onClick={() => showModal(item.id)} className="button-type-round button-color-white">삭제</Button>}
                  key="list-vertical-star-o"
                />,
              ]}
            >
              <div className="thumbnail-wrappper">
                <div className="thumbnail">
                  <img
                    onClick={() => handleOnClick({ id: item?.id })}
                    style={{ cursor: 'pointer' }}
                    alt="logo"
                    src={`${API_HOST}/${item?.postThumbnail}`}
                    onError={handleImgError}
                  />
                </div>
              </div>
              <Button className="button-type-anchor" onClick={() => handleOnClick({ id: item?.id })}>{item.postName ?? 'Temp Name'}</Button>
              <List.Item.Meta />
              <Typography.Paragraph
                style={{ minHeight: 66 }}
                ellipsis={{
                  rows: 3,
                  expandable: false,
                }}
              >
                {item.postDescription ?? 'Temp Description'}
              </Typography.Paragraph>
              {item.TempHashtags && (
                <Col>
                  {item.TempHashtags.map((item, i) => (
                    <Button
                      key={`button_${i}`}
                      className="tag-button"
                      type="primary"
                      shape="round"
                      style={{ marginTop: 10, marginRight: 10 }}
                    >
                      {item.hashtagName}
                    </Button>
                  ))}
                </Col>
              )}
            </List.Item>
          </>
        )}
      />
      <div
        className="listPost"
        style={{ width: "100%", height: 10 }}
        ref={targetRef}
      />
      {post?.length > 0 && <>
        <Modal
          className="modal-size-middle"
          title={<><Typography.Title level={3}>임시 글 삭제</Typography.Title></>}
          open={open}
          onOk={handleOk}
          closable={false}
          onCancel={handleCancel}
          okText="확인"
          cancelText="취소"
        >
          <Typography.Text>임시 저장한 글을 삭제하시겠습니까?<br />삭제한 글은 복구할 수 없습니다.</Typography.Text>
        </Modal>
      </>}
    </>
  );
}
