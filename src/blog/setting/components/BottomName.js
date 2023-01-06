import { Button, Col, Divider, Input, message, Row, Tooltip, Typography } from "antd"
import React, { useEffect, useRef } from "react"
import { useDispatch, useSelector } from "react-redux";
import { actions, Types } from "../state";
import { actions as commonActions } from "../../../common/state";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { FetchStatus } from "../../../common/constant";

export default function BottomName() {
  const dispatch = useDispatch();
  const user = useSelector(state => state.auth.user);
  const nickNameUpdate = useSelector(state => state.setting.nickNameUpdate);
  const nickName = useSelector(state => state.setting.nickName);
  const nickNameRef = useRef(null);
  const { fetchStatus } = useFetchInfo(Types.FetchUpdateNickName);

  useEffect(() => {
    /* 닉네임값 초기세팅 -> 수정 시 기본값 세팅 */
    if (!nickName) {
      dispatch(actions.setValue("nickName", user?.nickName));
    }
  }, [user])

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
      message.error("10자 이내의 한/영/숫자만 입력해주세요!");
      dispatch(actions.setValue("nickName", ""));
      nickNameRef.current.focus();
      return;
    }

    /* 닉네임 변경 사가함수 호출 */
    dispatch(actions.fetchUpdateNickName({ nickName }));
  }

  return (
    <>
      <Divider className="bottom_name" />
      <Row justify="center" style={{ width: '100%' }} className="box-flex-start bottom_name">
        <Col style={{ marginRight: 30, width: 160 }}>
          {nickNameUpdate && <>
            <Tooltip title="10자 이내의 한/영/숫자로 입력해주세요.">
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
          </>}
          {!nickNameUpdate &&
            <>
              <Typography.Title level={4} className="top_name" style={{ minWidth: 140, color: '#d8b48b' }}>
                {user?.nickName ?? 'noNamed'}
              </Typography.Title>
            </>
          }
        </Col>
        <Col>
          {nickNameUpdate &&
            <Button className="button-type-round button-color-normal" style={{ width: 86.63 }} onClick={onHandleUpdate}>완료</Button>
          }
          {!nickNameUpdate &&
            <Button className="button-type-round button-color-normal" style={{ width: 86.63 }} onClick={() => dispatch(actions.setValue("nickNameUpdate", !nickNameUpdate))}>수정</Button>
          }
        </Col>
      </Row>
    </>
  )
}