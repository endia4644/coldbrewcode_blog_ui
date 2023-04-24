import { Button, Col, List, Modal, Typography } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";
import { actions as writeActions } from "../../write/state";
import { API_HOST, FetchStatus } from "../../../common/constant";
import defaultImg from "./../../../common/images/beans.svg";
import { createActionBar } from "../../../common/util/actionBar";
import { createImgErrorHandler } from "../../../common/util/imgErrorHandler";

export default function Post() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const targetRef = useRef(null);
  const post = useSelector(state => state.temp.post);
  const [delTempId, setDelTempId] = useState("");

  // 액션바 생성함수 호출
  const action = createActionBar();

  // 이미지 오류 핸들러 호출
  const handleImgError = createImgErrorHandler({ defaultImg });

  const { fetchStatus, totalCount } = useFetchInfo(Types.FetchAllPost);

  /**
   * @description 게시글 클릭시 상세페이지로 이동 처리
   * @param {object} id 
   */
  function handleOnClick({ id }) {
    dispatch(actions.fetchWritePost({ id }))
    dispatch(writeActions.setValue("postType", "temp"));
    dispatch(writeActions.setValue("tempId", id));
    navigate('/blog/write');
  }

  const [open, setOpen] = useState(false);

  /**
   * @description 임시글 삭제 팝업 오픈 함수
   * @param {string} id 
   */
  function showModal(id) {
    // 삭제할 임시글의 ID 저장
    setDelTempId(id);
    setOpen(true);
  };

  /**
   * 임시글 삭제 핸들링
   */
  const handleOk = () => {
    dispatch(actions.fetchDeleteTempPost({ id: delTempId, post }))
    setOpen(false);
  };

  /**
   * 임시글 삭제 취소 핸들링
   */
  const handleCancel = () => {
    setDelTempId("");
    setOpen(false);
  };

  useEffect(() => {
    let observer;
    if (targetRef.current) {
      observer = new IntersectionObserver((entries, observer) => {
        entries.forEach((entry) => {
          /**
           * 스크롤이 옵저버가 감시하는 지점이 도착했으며 FetchAllPost action의 상태가
           * undefined 거나 Success 일때만 새로운 리스트를 요청한다.
           * undefined는 첫 요청시에 호출되기 위하여 필요하다.
           * 첫 요청 후 FetchAllPost action의 상태는 Success로 변경된다.
           */
          if (entry.isIntersecting && (fetchStatus === undefined || fetchStatus === FetchStatus.Success)) {
            // 게시글 추가 조회
            dispatch(
              actions.fetchAllPost({
                post,
                totalCount,
              })
            );
          }
        });
      });
      observer.observe(targetRef.current);
    }
    return () => observer && observer.disconnect();
  }, [dispatch, post, totalCount, fetchStatus]);
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
              // showModal은 삭제버튼의 clickEvent 함수로 넘긴다.
              actions={action({ item, type: 'temp', tempShowModal: showModal })}
            >
              <div className="thumbnail-wrappper">
                <div className="thumbnail">
                  <img
                    onClick={() => handleOnClick({ id: item?.id })}
                    style={{ cursor: 'pointer' }}
                    alt="logo"
                    // 이미지를 가져올 때 postThumbnail 값이 없을 경우 의미없는 404 에러 발생 방지
                    src={`${item?.postThumbnail && item?.postThumbnail !== 'null' ? `${API_HOST}/${item?.postThumbnail}` : defaultImg}`}
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
