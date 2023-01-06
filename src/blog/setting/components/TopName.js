import { Button, Col, Input, message, Tooltip, Typography } from "antd"
import React, { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux";
import { FetchStatus } from "../../../common/constant";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";
import { actions as commonActions } from "../../../common/state";

export default function TopName() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const nickNameUpdate = useSelector(state => state.setting.nickNameUpdate);
  const nickName = useSelector(state => state.setting.nickName)
  const nickNameRef = useRef(null);
  const { fetchStatus } = useFetchInfo(Types.fetchUpdateNickName);

  useEffect(() => {
    /* 닉네임값 초기세팅 -> 수정 시 기본값 세팅 */
    if (!nickName) {
      dispatch(actions.setValue("nickName", user?.nickName));
    }
  }, [])

  useEffect(() => {
    if (fetchStatus === FetchStatus.Success) {
      dispatch(actions.setValue("nickNameUpdate", false));
      const params = {
        actionType: Types.FetchUpdateNickName,
        status: FetchStatus.Delete,
      };
      dispatch(commonActions.setFetchStatus(params))
    }
    if (fetchStatus === FetchStatus.Fail) {
      dispatch(actions.setValue("nickNameUpdate", false));
      dispatch(actions.setValue("nickName", user?.nickName));
    }
  }, [fetchStatus])

  const onHandleUpdate = () => {
    const regEx = /^[0-9a-zA-Zㄱ-힣]{1,10}$/g
    if (!nickName) {
      message.error("닉네임을 입력해주세요!");
      dispatch(actions.setValue("nickName", ""));
      nickNameRef.current.focus();
      return;
    }

    if (!regEx.test(nickName)) {
      console.log(nickName);
      message.error("10자 이내의 한/영/숫자만 입력해주세요!");
      dispatch(actions.setValue("nickName", ""));
      nickNameRef.current.focus();
      return;
    }

    /* 닉네임 변경 사가함수 호출 */
    dispatch(actions.fetchUpdateNickName({ nickName }));
  }

  return (
    <Col className="top-name" style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginBottom: 50 }}>
      {nickNameUpdate && <>
        <Input.Group compact className="top_name">
          <Tooltip title="10자 이내의 한/영/숫자만 입력가능합니다.">
            <Input
              ref={nickNameRef}
              style={{
                width: 160,
              }}
              defaultValue={user?.nickName} placeholder="닉네임을 입력해주세요"
              onChange={(e) => dispatch(actions.setValue("nickName", e.target.value))}
              maxLength={10}
              value={nickName}
            />
          </Tooltip>
          <Button className="button-type-round button-color-normal" onClick={onHandleUpdate}> 완료</Button>
        </Input.Group>
      </>}
      {
        !nickNameUpdate &&
        <>
          <Typography.Title level={4} className="top_name" style={{ marginRight: 15, color: '#d8b48b' }}>
            {user?.nickName ?? 'noNamed'}
          </Typography.Title>
          <Button className="button-type-round button-color-normal" onClick={() => dispatch(actions.setValue("nickNameUpdate", !nickNameUpdate))}>수정</Button>
        </>
      }
    </Col >
  )
}