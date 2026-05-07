import {
  Button,
  Col,
  Divider,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { actions, Types } from "../state";
import { actions as common } from "../../../common/state";
import useQuery from "../../auth/hook/useQuery";

import "../scss/post.scss";
import { elapsedTime } from "../../../common/util/util";
import Hashtag from "../components/Hashtag";
import Topbar from "../components/TopBar";
import Comment from "../components/Comment";
import PostMoveButton from "../components/PostMoveButton";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import {AuthStatus, BLOG, FetchStatus} from "../../../common/constant";
import CommentForm from "../components/CommentForm";
import SideBar from "../components/SideBar";
import ButtonGroup from "antd/lib/button/button-group";
import hljs from "highlight.js/lib/common";
import renderMathInElement from "katex/contrib/auto-render";
import "katex/dist/katex.min.css";

export default function Post() {
  const { id } = useParams();
  let query = useQuery();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const post = useSelector((state) => state.post.post);
  const comment = useSelector((state) => state.post.comment_0);
  const commentCount = useSelector((state) => state.post.commentCount);
  const { fetchStatus } = useFetchInfo(Types.FetchGetPost, id);
  const { fetchStatus: dFetchStatus } = useFetchInfo(Types.FetchRemovePost, id);
  const { fetchStatus: likeAddStatus } = useFetchInfo(Types.FetchAddPostLike, id);
  const { fetchStatus: likeRemoveStatus } = useFetchInfo(Types.FetchRemovePostLike, id);
  const postType = query.get("postType") ?? "post";

  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);

  const [activeLike, setActiveLike] = useState(false);
  const [activeLikeCount, setActiveLikeCount] = useState(0);
  const [open, setOpen] = useState(false);

  // 파일 프리뷰 팝업 오픈 제어
  const [previewOpen, setPreviewOpen] = useState(false);
  // 프리뷰 이미지 저장용
  const [previewImage, setPreviewImage] = useState(null);

  /**
   * @description 동적생성된 컨텐츠에서 이미지 클릭시 이벤트 핸들링
   * @param {object} e
   */
  function clickHandler(e) {
    let el = e.target;
    while (el && el !== e.currentTarget && el.tagName !== "IMG") {
      el = el.parentNode;
    }
    if (el && el.tagName === "IMG") {
      // 이미지 URL을 저장
      setPreviewImage(el.src);
      // 이미지 팝업 오픈
      setPreviewOpen(true);
    }
  }

  /**
   * 삭제 확인 모달 호출
   */
  const showModal = () => {
    setOpen(true);
  };

  /**
   * 작성 완료 핸들러
   */
  const handleOk = () => {
    dispatch(actions.fetchRemovePost({ postId: id }));
    setOpen(false);
  };

  /**
   *  작성 취소 핸들러
   */
  const handleCancel = () => {
    setOpen(false);
  };

  /* 미리보기 팝업 취소 핸들링 */
  const handlePrevCancel = () => setPreviewOpen(false);

  useEffect(() => {
    /* 게시글 정보 조회 */
    dispatch(actions.fetchGetPost({ id, postType }));
  }, [dispatch, id, postType]);

  useEffect(() => {
    /* 답글 정보 조회 */
    dispatch(actions.fetchGetComment(0, id));
  }, [dispatch, id]);

  useEffect(() => {
    if (dFetchStatus === FetchStatus.Success) {
      navigate(`/blog/@${user.nickName}`);
    }
  }, [dispatch, navigate, dFetchStatus]);

  useEffect(() => {
    // 최초 로딩시 highlight 활성화
    setTimeout(() => {
      hljs.highlightAll();
    }, 150);
  }, []);

  useEffect(() => {
    if (!post?.postContent) return;
    const el = document.querySelector('.ck-content');
    if (el) renderMathInElement(el, { throwOnError: false });
  }, [post]);

  useEffect(() => {
    /* 게시글이 없을경우 메인페이지로 강제이동 */
    if (fetchStatus === FetchStatus.Success && !post) {
      navigate(BLOG);
    }
  }, [fetchStatus, navigate, post]);

  useEffect(() => {
    if (post) {
      setActiveLike(post.likeYsno);
      setActiveLikeCount(post.likeCount);
    }
  }, [post?.id]);

  useEffect(() => {
    if (likeAddStatus === FetchStatus.Fail) {
      setActiveLike((prev) => !prev);
      setActiveLikeCount((prev) => prev - 1);
      dispatch(common.setFetchStatus({ actionType: Types.FetchAddPostLike, fetchKey: id, status: FetchStatus.Delete }));
    }
  }, [likeAddStatus]);

  useEffect(() => {
    if (likeRemoveStatus === FetchStatus.Fail) {
      setActiveLike((prev) => !prev);
      setActiveLikeCount((prev) => prev + 1);
      dispatch(common.setFetchStatus({ actionType: Types.FetchRemovePostLike, fetchKey: id, status: FetchStatus.Delete }));
    }
  }, [likeRemoveStatus]);

  function likeClick() {
    setActiveLike((prev) => !prev);
    if (activeLike) {
      dispatch(actions.fetchRemovePostLike(id));
      setActiveLikeCount((prev) => prev - 1);
    } else {
      dispatch(actions.fetchAddPostLike(id));
      setActiveLikeCount((prev) => prev + 1);
    }
  }

  return (
    <>
      {fetchStatus === FetchStatus.Success && (
        <>
          <Row justify="center">
            <Col>
              <SideBar id={id} activeLike={activeLike} activeLikeCount={activeLikeCount} onLikeClick={likeClick} />
            </Col>
          </Row>
          <Row
              style={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography.Title
                className="post-name"
                style={{ marginBottom: 0 }}
            >
              {post?.postName}
            </Typography.Title>
            {status === AuthStatus.Login && user?.id === post.User.id && (
                <ButtonGroup>
                  <Button
                      className="button-type-round button-color-white"
                      style={{ marginRight: 5 }}
                      onClick={() => {
                        navigate(`/blog/write/${id}`);
                      }}
                  >
                    수정
                  </Button>
                  <Button
                      className="button-type-round button-color-white"
                      onClick={showModal}
                  >
                    삭제
                  </Button>
                </ButtonGroup>
            )}
          </Row>
          <Row style={{ marginTop: "2rem" }}>
            <Space
                split={<Divider type="vertical" />}
                style={{ paddingLeft: 5, opacity: 0.8 }}
                className="post-information"
            >
              <Typography.Title level={5} style={{ fontWeight: 600 }}>
                {post?.User?.nickName}
              </Typography.Title>
              <Typography.Title level={5} style={{ fontWeight: 500 }}>
                {elapsedTime(post?.createdAt)}
              </Typography.Title>
              <Topbar
                  activeLike={activeLike}
                  activeLikeCount={activeLikeCount}
                  onLikeClick={likeClick}
              />
            </Space>
          </Row>
          <Row style={{ marginTop: "1rem" }}>
            {post?.Hashtags && <Hashtag hashtags={post?.Hashtags} />}
          </Row>
          <Divider />
          <Row style={{ marginTop: "4rem", marginBottom: "3rem" }}>
            {post?.Hashtags && (
                <div
                    onClick={clickHandler}
                    className="ck-content"
                    dangerouslySetInnerHTML={{ __html: post?.postContent }}
                ></div>
            )}
          </Row>
          <Divider />
          {(post?.prev || post?.next) && (
              <>
                <Row justify="center">
                  <Col
                      className="post-button-box"
                      style={!post?.prev && { justifyContent: "flex-end" }}
                  >
                    {post?.prev && (
                        <PostMoveButton
                            direction="left"
                            post={post?.prev}
                            postType={postType}
                        />
                    )}
                    {post?.next && (
                        <PostMoveButton
                            direction="right"
                            post={post?.next}
                            postType={postType}
                        />
                    )}
                  </Col>
                </Row>
                <Divider />
              </>
          )}
          <Row justify="start" style={{ marginTop: "4rem" }}>
            <Col>
              <Typography.Title level={3}>
                {commentCount} 개의 댓글
              </Typography.Title>
            </Col>
          </Row>
          <Row justify="start" style={{ marginTop: "2rem" }}>
            <Col>
              <CommentForm
                  postId={id}
                  parentId={null}
                  commentDepth={"0"}
                  comment={comment}
                  commentCount={commentCount}
                  updateYsno={undefined}
              />
            </Col>
          </Row>
          <Row
              className="comment-box"
              justify="start"
              style={{ marginTop: "2rem", paddingBottom: "3rem" }}
          >
            {comment.length > 0 &&
                comment.map((item) => (
                    <Comment
                        key={`comment_${item.id}`}
                        data={item}
                        parentId={null}
                        postId={id}
                    />
                ))}
          </Row>
          {user?.id === post.User.id && (
            <>
              <Modal
                className="modal-size-middle"
                title={
                  <>
                    <Typography.Title level={3}>게시글 삭제</Typography.Title>
                  </>
                }
                open={open}
                onOk={handleOk}
                closable={false}
                onCancel={handleCancel}
                okText="확인"
                cancelText="취소"
              >
                <Typography.Text>
                  게시글을 삭제하시겠습니까?
                  <br />
                  삭제한 글은 복구할 수 없습니다.
                </Typography.Text>
              </Modal>
            </>
          )}
          <Modal
            open={previewOpen}
            title="원본보기"
            footer={null}
            onCancel={handlePrevCancel}
          >
            <img
              alt="example"
              style={{
                width: "100%",
              }}
              src={previewImage}
            />
          </Modal>
        </>
      )}
    </>
  );
}
