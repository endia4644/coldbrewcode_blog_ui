import { Button } from "antd";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { actions } from "../../main/state";

/**
 *
 * @param {object} hashtags
 */
export default function Hashtag({ hashtags }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  function onClick(e, id) {
    dispatch(actions.setValue("sideActiveKey", id + ""));
    dispatch(actions.fetchHashtagPost(null, 0, id));
    navigate("/blog");
  }
  return (
    <>
      {hashtags?.map((item) => {
        return (
          <Button
            key={item.id}
            className="button-type-circle button-color-normal"
            style={{ marginRight: 10 }}
            onClick={(e) => onClick(e, item.id)}
          >
            {item.hashtagName}
          </Button>
        );
      })}
    </>
  );
}
