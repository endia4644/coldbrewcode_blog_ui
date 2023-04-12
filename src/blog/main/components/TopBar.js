import { Tabs } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { actions, Types } from "../state";
import { actions as commonActions } from "../../../common/state";
import { FetchType } from "../../../common/constant";

export default function Topbar({ hashtag }) {
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
  };

  return (
    <>
      <Tabs
        style={{ paddingLeft: 20, paddingRight: 20 }}
        className="main-topbar"
        defaultActiveKey="0"
        activeKey={sideActiveKey}
        tabPosition="top"
        onTabClick={onTabClick}
        onChange={onchangFunction}
        items={hashtag.map((item, i) => {
          return {
            label: `${item.hashtagName} (${item.postCount})`,
            key: item.id + "",
          };
        })}
      ></Tabs>
    </>
  );
}
