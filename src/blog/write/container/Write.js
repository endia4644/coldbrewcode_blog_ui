
import React from 'react';
import { Content } from "antd/lib/layout/layout";
import "react-quill/dist/quill.snow.css";
import Editor from '../component/Editor';


export default function Write() {
  return (
    <>
      <Content className="main-content" style={{ paddingTop: 30 }}>
        <Editor placeholder={'작성하세요'} value={undefined} />
      </Content>
    </>
  )
}