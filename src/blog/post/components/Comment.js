import React, { useEffect, useState } from "react";
import { Avatar, Button, Comment, Form } from "antd";
import { useDispatch, useSelector } from "react-redux";
import TextArea from "antd/lib/input/TextArea";
import { actions } from "../state";

export default function Comments({ data }) {
  const dispatch = useDispatch();
  const [expend, setExpend] = useState(false);
  const comment = useSelector((state) => state.post[`comment_${data.id}`]);

  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    dispatch(actions.fetchGetComment(data?.id));
  }, [dispatch, data?.id]);

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
          <Form onFinish={(e) => console.log(e)}>
            <Form.Item name="comment">
              <TextArea
                name="comment"
                className="input-type-round"
                showCount
                maxLength={200}
                rows={6}
                cols={100}
                style={{
                  resize: "none",
                }}
              />
            </Form.Item>
            <Form.Item
              style={{ display: "flex", flexDirection: "row-reverse" }}
            >
              <Button
                htmlType="submit"
                className="button-type-round button-color-reverse button-size-small"
              >
                답글 작성
              </Button>
            </Form.Item>
          </Form>
          {comment?.childComment &&
            comment?.childComment.map((item) => (
              <Comments key={item.id} data={item} />
            ))}
        </>
      )}
    </Comment>
  );
}
