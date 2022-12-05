import React, { useRef, useState } from "react";
import { Avatar, Button, Col, Comment, Row, Space } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../state";
import CommentForm from "./CommentForm";
import { elapsedTime } from "../../../common/util/util.js";

export default function Comments({ data, postId, parentId}) {
  const dispatch = useDispatch();
  const [expend, setExpend] = useState(false);
  const comment = useSelector((state) => state.post[`comment_${data.id}`]);
  const commentCount = useSelector((state) => state.post.commentCount);
  const user = useSelector((state) => state.auth.user);
  const contentRef = useRef(null);
  
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
            <span>{data?.User?.nickname}</span>
          </Col>
          {user?.id === data?.User?.id && (
            <Col>
              <Button
                className="button-type-round button-color-normal button-size-mini"
                style={{ marginRight: 5 }}
              >
                수정
              </Button>
              <Button
                className="button-type-round button-color-normal button-size-mini"
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
        <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
      }
      content={<p ref={contentRef}>{data?.commentContent}</p>}
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
            <span>{data?.User?.nickname}</span>
          </Col>
        </Row>
      }
      avatar={
        <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
      }
      content={<p ref={contentRef}>삭제 된 글입니다.</p>}
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
