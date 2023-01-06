import { Col, Row, Switch, Typography } from "antd"
import React from "react"
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../state";

export default function EmailReciveSetting() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);

  const onChangeComment = (checked) => {
    dispatch(actions.fetchUpdateCommentNoticeYsno({ commentNoticeYsno: checked ? 'Y' : 'N' }))
  };

  const onChangeNewPost = (checked) => {
    dispatch(actions.fetchUpdateNewPostNoticeYsno({ newPostNoticeYsno: checked ? 'Y' : 'N' }))
  };

  return (
    <Col style={{ display: 'flex', flexDirection: 'column', alignItems: 'stretch' }}>
      <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Col style={{ marginRight: 15 }}>
          <Typography.Title level={5}>댓글알림</Typography.Title>
        </Col>
        <Col>
          <Switch checked={user?.commentNoticeYsno === 'Y' ? true : false} onChange={onChangeComment} />
        </Col>
      </Row>
      <Row style={{ display: 'flex', justifyContent: 'space-between' }}>
        <Col style={{ marginRight: 15 }}>
          <Typography.Title level={5}>새글 소식 알림</Typography.Title>
        </Col>
        <Col>
          <Switch checked={user?.newPostNoticeYsno === 'Y' ? true : false} onChange={onChangeNewPost} />
        </Col>
      </Row>
    </Col >
  )
}