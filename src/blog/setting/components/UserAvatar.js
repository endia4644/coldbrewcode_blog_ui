import { UserOutlined } from "@ant-design/icons";
import { Avatar, Button, Col, message } from "antd"
import React from "react"
import { useDispatch, useSelector } from "react-redux";
import { API_HOST } from "../../../common/constant";
import { actions } from "../state";

export default function UserAvatar() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const profileImg = useSelector(state => state.setting.profileImg);

  const encodeFileToBase64 = async (fileBlob) => {
    const isJpgOrPng = fileBlob.type === "image/jpeg" || fileBlob.type === "image/png" || fileBlob.type === "image/gif";
    if (!isJpgOrPng) {
      message.error("JPG/PNG/GIF 유형만 올려주세요");
      return;
    }
    const isLt2M = fileBlob.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("용량이 2MB를 초과할 수 없습니다");
      return;
    }
    const formData = new FormData();
    formData.append("image", fileBlob);
    dispatch(actions.fetchCreateProfileImg({ formData, fileBlob }));
  }


  return (
    <Col style={{ display: 'flex', flexDirection: 'column', marginRight: 30 }}>
      <label htmlFor="file">
        <Avatar
          size={{ xs: 128, sm: 128, md: 128, lg: 132, xl: 140, xxl: 140 }}
          icon={profileImg ? <img src={profileImg} alt="preview-img" /> : user?.profileImg ? <img src={`${API_HOST}/${user?.profileImg}`} alt="preview-img" /> : <UserOutlined />}
          style={{ marginBottom: 20 }}
        />
      </label>
      <label htmlFor="file">
        <div className="button-type-round button-color-normal" style={{ paddingTop: 5 }}>이미지 등록 / 수정</div>
      </label>
      <input
        type="file"
        name="file"
        id="file"
        accept="image/jpg, image/png, image/jpeg, image/gif"
        onChange={(e) => encodeFileToBase64(e.target.files[0])}
      />
      {user?.profileImg &&
        <Button className="button-type-round button-color-normal" style={{ marginTop: 10 }} onClick={() => dispatch(actions.fetchDeleteProfileImg())}>이미지 제거</Button>
      }
    </Col>
  )
}