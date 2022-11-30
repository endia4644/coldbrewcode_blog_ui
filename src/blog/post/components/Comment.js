import React, { useEffect, useState } from "react";
import { Avatar, Comment } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../state";
import CommentForm from "./CommentForm";

export default function Comments({ data, postId }) {
  const dispatch = useDispatch();
  const [expend, setExpend] = useState(false);
  const comment = useSelector((state) => state.post[`comment_${data.id}`]);

  useEffect(() => {
    console.log(`comment_${data.id}`);
    dispatch(actions.fetchGetComment(postId, `comment_${data.id}`));
  }, [dispatch, postId]);

  return (
    <Comment
      style={{ width: "100%" }}
      actions={[
        <span
          key="comment-nested-reply-to"
          onClick={() => {
            setExpend(!expend);
          }}
        >
          {data.commentDepth < 2 && (expend ? "답글 접기" : "답글 달기")}
        </span>,
      ]}
      author={"Han Solo"}
      avatar={
        <Avatar src="https://joeschmoe.io/api/v1/random" alt="Han Solo" />
      }
      content={<p>{data?.commentContent}</p>}
      datetime={<span>8 hours ago</span>}
    >
      {data.commentDepth < 2 && expend && (
        <>
          <CommentForm postId parentId={data.id} commentDepth={Number(data.commentDepth) + 1} comment={comment} />
          {comment?.childComment &&
            comment?.childComment.map((item) => (
              <Comments key={`comment_${item.id}`} data={item} postId={postId} />
            ))}
        </>
      )}
    </Comment>
  );
}
