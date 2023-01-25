import { BackTop, Button, Col, Divider, Modal, Row, Space, Typography } from "antd";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { actions, Types } from "../state";
import { actions as authActions } from "../../auth/state";
import { actions as mainActions, Types as mainTypes } from "../../main/state";
import { actions as commonActions } from "../../../common/state";
import { Content, Header } from "antd/lib/layout/layout";
import Settings from "../../main/components/Settings";
import useQuery from "../../auth/hook/useQuery";

import "../scss/post.scss";
import { elapsedTime } from "../../../common/util/util";
import Hashtag from "../components/Hashtag";
import SideBar from "../components/SideBar";
import Topbar from "../components/TopBar";
import Comment from "../components/Comment";
import PostMoveButton from "../components/PostMoveButton";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { AuthStatus, FetchStatus } from "../../../common/constant";
import CommentForm from "../components/CommentForm";
import ButtonGroup from "antd/lib/button/button-group";
import Navigation from "../components/Navigation";
import { UpArrowIcon } from "../../../common/components/Icon";

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
  const postType = query.get("postType") ?? 'post';

  const status = useSelector((state) => state.auth.status);
  const user = useSelector((state) => state.auth.user);

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    dispatch(actions.fetchRemovePost({ postId: id }))
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  function logout() {
    dispatch(authActions.fetchLogout());
  }

  useEffect(() => {
    dispatch(actions.fetchGetPost({ id, postType }));
  }, [dispatch, id]);

  useEffect(() => {
    dispatch(actions.fetchGetComment(0, id));
  }, [dispatch, id]);

  useEffect(() => {
    /* 삭제가 성공한 경우 blog 화면으로 이동 */
    if (dFetchStatus === FetchStatus.Success) {
      dispatch(mainActions.setValue("series", []));
      dispatch(commonActions.setFetchStatus({
        actionType: mainTypes.FetchAllSeries,
        status: FetchStatus.Delete,
      }))
      navigate('/blog');
    }
  }, [dFetchStatus])

  useLayoutEffect(() => {
    if (fetchStatus !== FetchStatus.Request && !post) {
      navigate("/blog");
    }
  }, [fetchStatus, navigate, post]);


  useEffect(() => {
    return () => {
      /* 언마운트 시 Main 리스트를 최신화 */
      dispatch(mainActions.setValue("post", []));
      dispatch(commonActions.setFetchStatus({
        actionType: mainTypes.FetchAllPost,
        status: FetchStatus.Delete,
      }))
    }
  }, [])

  return (
    <>
      {fetchStatus === FetchStatus.Success && (
        <>
          <Header className="site-layout-background main-header fix-menu">
            <Row justify="end">
              <Col>
                <Settings logout={logout} />
              </Col>
            </Row>
          </Header>
          <Row justify="center">
            <Col>
              <SideBar
                id={id}
                likeCount={post?.likeCount}
                likeYsno={post?.likeYsno}
              />
            </Col>
            <Col>
              <Navigation
                postContent={post?.postContent}
              />
            </Col>
          </Row>
          <Content className="post-wrap main-content">
            <Row style={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography.Title
                className="post-name"
                style={{ marginBottom: 0 }}
              >
                {post?.postName}
              </Typography.Title>
              {status === AuthStatus.Login && user?.userType === "admin" && (
                <ButtonGroup>
                  <Button
                    className="button-type-round button-color-white"
                    style={{ marginRight: 5 }}
                    onClick={() => {
                      navigate(`/blog/write/${id}`)
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
                  id={id}
                  likeCount={post?.likeCount}
                  likeYsno={post?.likeYsno}
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
                  className="post-content"
                  dangerouslySetInnerHTML={{ __html: post?.postContent }}
                ></div>
              )}
            </Row>
            <Divider />
            {(post?.prev || post?.next) &&
              <>
                <Row justify="center">
                  <Col className="post-button-box" style={!post?.prev && { justifyContent: 'flex-end' }} >
                    {post?.prev && <PostMoveButton direction="left" post={post?.prev} postType={postType} />}
                    {post?.next && <PostMoveButton direction="right" post={post?.next} postType={postType} />}
                  </Col>
                </Row>
                <Divider />
              </>
            }
            <Row justify="start" style={{ marginTop: "4rem" }}>
              <Col>
                <Typography.Title level={3}>{commentCount} 개의 댓글</Typography.Title>
              </Col>
            </Row>
            <Row justify="start" style={{ marginTop: "2rem" }}>
              <Col>
                <CommentForm postId={id} parentId={null} commentDepth={'0'} comment={comment} commentCount={commentCount} updateYsno={undefined} />
              </Col>
            </Row>
            <Row
              className="comment-box"
              justify="start"
              style={{ marginTop: "2rem", paddingBottom: "3rem" }}
            >
              {comment.length > 0 &&
                comment.map((item) => (
                  <Comment key={`comment_${item.id}`} data={item} parentId={null} postId={id} />
                ))}
            </Row>
            <BackTop>
              <div>
                <UpArrowIcon />
              </div>
            </BackTop>
          </Content>
          {user?.userType === 'admin' && <>
            <Modal
              className="modal-size-middle"
              title={<><Typography.Title level={3}>게시글 삭제</Typography.Title></>}
              open={open}
              onOk={handleOk}
              closable={false}
              onCancel={handleCancel}
              okText="확인"
              cancelText="취소"
            >
              <Typography.Text>게시글을 삭제하시겠습니까?<br />삭제한 글은 복구할 수 없습니다.</Typography.Text>
            </Modal>
          </>}
        </>
      )}
    </>
  );
}