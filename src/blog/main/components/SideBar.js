import { Affix, Col, Divider, Row, Tabs } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, Types } from "../state";
import Search from "./Search";
import { actions as commonActions } from "../../../common/state";
import { FetchType } from "../../../common/constant";

export default function SideBar({ hashtag }) {
  const dispatch = useDispatch();
  const sideActiveKey = useSelector((state) => state.main.sideActiveKey);

  const onchangFunction = (sideActiveKey) => {
    window.scrollTo(0, 0);
    dispatch(actions.setValue("post", []));
    dispatch(commonActions.setFetchStatus({
      actionType: Types.FetchAllPost,
      fetchType: FetchType.Delete,
    }))
    dispatch(
      actions.fetchAllPost({ hashtag: sideActiveKey !== "ALL" ? sideActiveKey : "" })
    );
  };
  /* 사이드탭 제어함수 */
  const onTabClick = (target) => {
    dispatch(actions.setValue("sideActiveKey", target));
    /* 태그 클릭 시 글/시리즈 탭도 글로 고정 */
    dispatch(actions.setValue("activeKey", 'post'));
  };
  return (
    <>
      <Affix className="main-sidebar">
        <Row
          className="main-side"
          style={{ position: "absolute", left: "-40.5rem", top: "14rem" }}
        >
          <Col>
            <Search className="side" />
            <Divider />
            <Col style={{ marginTop: 20 }}>
              <Tabs
                onChange={onchangFunction}
                tabPosition="left"
                defaultActiveKey="ALL"
                activeKey={sideActiveKey}
                onTabClick={onTabClick}
                items={hashtag.map((item, i) => {
                  return {
                    label: `${item.hashtagName} (${item.postCount})`,
                    key: item.id + "",
                  };
                })}
              />
            </Col>
          </Col>
        </Row>
      </Affix>
    </>
  );
}
