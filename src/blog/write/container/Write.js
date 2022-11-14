
import React from 'react';
import { Content } from "antd/lib/layout/layout";
import "react-quill/dist/quill.snow.css";
import Editor from '../component/Editor';
import { Divider, Input } from 'antd';


export default function Write() {
  return (
    <>
      <Content className="main-content main-writer" style={{ paddingTop: 30 }}>
        <Input className='post-title' placeholder="제목를 입력하세요." />
        <Divider />
        <Input className='post-tag' placeholder="태그를 입력하세요." />
        <Divider />
        <Editor placeholder={'기록하고 싶은 이야기를 적어 보세요'} value={undefined} />
      </Content>
    </>
  )
}