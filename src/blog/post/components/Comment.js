import React, { useState } from "react";
import { Avatar, Button, Col, Comment, Row } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../state";
import CommentForm from "./CommentForm";
import { elapsedTime } from "../../../common/util/util.js";
import { API_HOST } from "../../../common/constant";
import { UserOutlined } from "@ant-design/icons";

export default function Comments({ data, postId, parentId }) {
  const dispatch = useDispatch();
  const [expend, setExpend] = useState(false);
  const [isUpdate, setIsUpdate] = useState(false);
  const comment = useSelector((state) => state.post[`comment_${data.id}`]);
  const commentCount = useSelector((state) => state.post.commentCount);
  const user = useSelector((state) => state.auth.user);

  return (
    (data?.dltYsno === 'N') ?
      <Comment
        style={{ width: "100%" }}
        actions={[
          <span
            key="comment-nested-reply-to"
            onClick={() => {
              if (!expend) {
                dispatch(actions.fetchGetComment(data.id, postId));
              }
              setExpend(!expend);
            }}
          >
            {data?.commentDepth < 2 && (expend ? "답글 접기" : "답글 달기")}
          </span>,
        ]}
        author={
          <Row>
            <Col>
              <span>{data?.User?.nickName}</span>
            </Col>
            {user?.id === data?.User?.id && (
              <Col>
                <Button
                  className="button-type-round button-color-white button-size-mini"
                  style={{ marginRight: 5 }}
                  onClick={() => {
                    setIsUpdate(!isUpdate);
                  }}
                >
                  {isUpdate ? '수정 취소' : '수정'}
                </Button>
                <Button
                  className="button-type-round button-color-white button-size-mini"
                  onClick={() => {
                    dispatch(actions.fetchRemoveComment(
                      data?.id,
                      parentId,
                      data?.commentDepth,
                      commentCount,
                      postId,
                    ));
                  }}
                >
                  삭제
                </Button>
              </Col>
            )}
          </Row>
        }
        avatar={
          <Avatar
            style={{ marginBottom: 4, boxShadow: '0px 0px 0px 0px' }}
            size={{ xs: 40, sm: 40, md: 40, lg: 40, xl: 40, xxl: 40 }}
            icon={data?.User?.profileImg ? <img src={`${API_HOST}/${data?.User?.profileImg}`} alt="preview-img" /> : <UserOutlined />}
          />
        }
        content={
          isUpdate ?
            <CommentForm
              postId={postId}
              parentId={parentId}
              commentId={data?.id}
              comment={comment}
              commentDepth={Number(data.commentDepth)}
              commentCount={commentCount}
              defaultContent={data?.commentContent}
              updateYsno={true}
              setIsUpdate={setIsUpdate}
            />
            :
            <p>{data?.commentContent}</p>

        }
        datetime={<span>{elapsedTime(data?.updatedAt)}</span>}
      >
        {data.commentDepth < 2 && expend && (
          <>
            <CommentForm
              postId={postId}
              parentId={data.id}
              commentDepth={Number(data.commentDepth) + 1}
              comment={comment}
              commentCount={commentCount}
              updateYsno={false}
            />
            {comment?.childComment &&
              comment?.childComment.map((item) => (
                <Comments
                  key={`comment_${item.id}`}
                  data={item}
                  postId={postId}
                  parentId={data.id}
                />
              ))}
          </>
        )}
      </Comment>
      :
      (data?.childCount > 0 && data?.dltYsno === 'Y' &&
        <Comment
          style={{ width: "100%" }}
          actions={[
            <span
              key="comment-nested-reply-to"
              onClick={() => {
                if (!expend) {
                  dispatch(actions.fetchGetComment(data.id, postId));
                }
                setExpend(!expend);
              }}
            >
              {data?.commentDepth < 2 && (expend ? "답글 접기" : "답글 달기")}
            </span>,
          ]}
          author={
            <Row>
              <Col>
                <span>{data?.User?.nickName}</span>
              </Col>
            </Row>
          }
          avatar={
            <Avatar
              style={{ marginBottom: 4, boxShadow: '0px 0px 0px 0px' }}
              size={{ xs: 40, sm: 40, md: 40, lg: 40, xl: 40, xxl: 40 }}
              icon={data?.User?.profileImg ? <img src={`${API_HOST}/${data?.User?.profileImg}`} alt="preview-img" /> : <UserOutlined />}
            />
          }
          content={<p>삭제 된 글입니다.</p>}
          datetime={<span>{elapsedTime(data?.updatedAt)}</span>}
        >
          {data.commentDepth < 2 && expend && (
            <>
              <CommentForm
                postId
                parentId={data.id}
                commentDepth={Number(data.commentDepth) + 1}
                comment={comment}
                commentCount={commentCount}
                updateYsno={false}
              />
              {comment?.childComment &&
                comment?.childComment.map((item) => (
                  <Comments
                    key={`comment_${item.id}`}
                    data={item}
                    postId={postId}
                    parentId={data.id}
                  />
                ))}
            </>
          )}
        </Comment>
      )
  )
}
