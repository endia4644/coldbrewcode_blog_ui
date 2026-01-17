import { SearchOutlined } from "@ant-design/icons";
import { Button, Row } from "antd";
import React, { useRef, useState } from "react";
import {useNavigate} from "react-router-dom";

export default function SearchBar({ className, nickname }) {
  const buttonRef = useRef(null);
  const searchRef = useRef(null);
  const [searchText, setSearchText] = useState("");
  const { navigate } = useNavigate();

  /**
   * 입력받은 검색어로 게시글 검색 ( 제목,소개,본문에서 검색함 )
   */
  const handleOnClick = () => {
    window.scrollTo(0, 0);
    if(searchText) {
      // 검색바의 내용을 지운다.
      setSearchText("");
      // 검색바의 포커싱을 제거한다.
      searchRef.current.blur();
      buttonRef.current.blur();
      navigate('/blog/search');
    }
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
      <Row style={{ width: '100%'}} justify="center">
        <input
          ref={searchRef}
          type={"text"}
          className={`search-bar ant-input ${className}`}
          style={{ width: '60%' }}
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
