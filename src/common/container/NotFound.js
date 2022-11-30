import { Button, Result } from "antd";
import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <>
      <Result
        style={{ marginTop: 160 }}
        status="404"
        title="404"
        subTitle="해당 하는 페이지를 찾을 수 없습니다"
        extra={
          <Button className="button-type-round button-color-normal">
            <Link to={"/"}>홈으로</Link>
          </Button>
        }
      />
    </>
  );
}
