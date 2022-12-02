import { Button, Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { actions } from "../state";

export default function CommentForm({
  postId,
  parentId,
  comment,
  commentDepth,
  commentCount,
}) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  function onFinish(item) {
    if (item.commentContent) {
      dispatch(
        actions.fetchAddComment({
          postId,
          parentId,
          commentContent: item.commentContent,
          commentDepth,
          comment,
          commentCount
        })
      );
    }
    form.resetFields();
  }
  return (
    <>
      <Form onFinish={onFinish} form={form}>
        <Form.Item name="commentContent">
          <TextArea
            name="commentContent"
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
        <Form.Item style={{ display: "flex", flexDirection: "row-reverse" }}>
          <Button
            htmlType="submit"
            className="button-type-round button-color-reverse button-size-small"
          >
            답글 작성
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
