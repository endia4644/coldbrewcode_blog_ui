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

  /**
   * 입력받은 검색어로 게시글 검색 ( 제목,소개,본문에서 검색함 )
   */
  const handleOnClick = () => {
    window.scrollTo(0, 0);
    dispatch(actions.setValue("post", []));
    // 검색 결과를 위해 기존 post 목록을 비움
    dispatch(commonActions.setFetchStatus({
      actionType: Types.FetchAllPost,
      fetchType: FetchType.Delete,
    }))
    // 게시글 검색
    dispatch(
      actions.fetchAllPost({ search: searchText })
    );
    // 검색바의 내용을 지운다.
    setSearchText("");
    // 검색바의 포커싱을 제거한다.
    searchRef.current.blur();
    buttonRef.current.blur();
  };

  /**
   * @description 엔터 이벤트 핸들링
   * @param {*} e 
   */
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
