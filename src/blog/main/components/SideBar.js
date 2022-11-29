import { Affix, Col, Divider, Row, Tabs } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../state";
import Search from "./Search";

export default function SideBar({ hashtag }) {
  const dispatch = useDispatch();
  const sideActiveKey = useSelector((state) => state.main.sideActiveKey);

  const onchangFunction = (sideActiveKey) => {
    window.scrollTo(0, 0);
    dispatch(
      actions.fetchHashtagPost(
        null,
        0,
        sideActiveKey !== "0" ? sideActiveKey : ""
      )
    );
  };
  /* 사이드탭 제어함수 */
  const onTabClick = (target) => {
    dispatch(actions.setValue("sideActiveKey", target));
  };
  return (
    <>
      <Affix className="main-sidebar">
        <Row
          className="main-side"
          style={{ position: "absolute", left: "-40.5rem", top: "14rem" }}
        >
          <Col>
            <Search />
            <Divider />
            <Col style={{ marginTop: 20 }}>
              <Tabs
                onChange={onchangFunction}
                tabPosition="left"
                defaultActiveKey="0"
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
