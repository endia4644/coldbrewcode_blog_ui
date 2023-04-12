import { SearchOutlined } from "@ant-design/icons";
import { Button, Row } from "antd";
import React, { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { actions, Types } from "../state";
import { actions as commonActions } from "../../../common/state";
import { FetchType } from "../../../common/constant";

export default function Search() {
  const dispatch = useDispatch();
  const buttonRef = useRef(null);
  const searchRef = useRef(null);
  const [searchText, setSearchText] = useState("");

  const handleOnClick = () => {
    window.scrollTo(0, 0);
    dispatch(actions.setValue("post", []));
    dispatch(commonActions.setFetchStatus({
      actionType: Types.FetchAllPost,
      fetchType: FetchType.Delete,
    }))
    dispatch(
      actions.fetchAllPost({ search: searchText })
    );
    setSearchText("");
    searchRef.current.blur();
    buttonRef.current.blur();
  };

  const handleOnKeyPress = (e) => {
    if (e.key === "Enter") {
      handleOnClick(); // Enter 입력이 되면 클릭 이벤트 실행
    }
  };

  return (
    <>
      <Row>
        <input
          ref={searchRef}
          type={"text"}
          className="search-bar ant-input"
          style={{ width: 219 }}
          value={searchText}
          onChange={(search) => setSearchText(search.target.value)}
          onKeyPress={handleOnKeyPress}
          placeholder="검색어를 입력하세요"
        />
        <Button
          ref={buttonRef}
          onClick={handleOnClick}
          icon={<SearchOutlined />}
          size="large"
        />
      </Row>
    </>
  );
}
