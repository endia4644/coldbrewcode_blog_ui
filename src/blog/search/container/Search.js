import {Col, Row, Typography} from "antd";
import React from "react";
import Post from "../components/Post";
import "../scss/Search.scss";
import {useSearchParams} from "react-router-dom";
import {isEmpty} from "../../../common/util/util";
import SearchBar from "../components/SearchBar";

export default function Search() {
  const [searchParams] = useSearchParams();

  const nickname = searchParams.get("nickname") || "";

  console.log(nickname);

  return (
    <>
      <Row justify="center" style={{ marginTop: 100 }}>
        {!isEmpty(nickname) && (
          <>
            <Row style={{ width: '100%'}} justify="center">
              <Col>
                <Typography.Title level={4}>{nickname} 님이 작성한 포스트 검색</Typography.Title>
              </Col>
            </Row>
            <SearchBar />
          </>
        )}
        <Col className="width-full">
          <Post />
        </Col>
      </Row>
    </>
  );
}
