import { Button, Col, Modal, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FetchStatus } from "../../../common/constant";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";

export default function SignOut() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { fetchStatus } = useFetchInfo(Types.FetchSignOutUser);

  function showModal(id) {
    setOpen(true);
  };

  const handleOk = () => {
    dispatch(actions.fetchSignOutUser());
    setOpen(false);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (fetchStatus === FetchStatus.Success) {
      navigate('/blog');
    }
  }, [fetchStatus])

  return (
    <Col>
      <Button className="button-type-round button-color-red" onClick={showModal}>회원 탈퇴</Button>
      <Modal
        className="modal-size-middle"
        title={<><Typography.Title level={3}>회원 탈퇴</Typography.Title></>}
        open={open}
        onOk={handleOk}
        closable={false}
        onCancel={handleCancel}
        okText="확인"
        cancelText="취소"
      >
        <Typography.Text>정말로 탈퇴하시겠습니까?</Typography.Text>
      </Modal>
    </Col >
  )
}