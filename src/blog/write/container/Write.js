
import React, { useEffect, useRef, useState } from 'react';
import { Content, Footer } from "antd/lib/layout/layout";
import "react-quill/dist/quill.snow.css";
import Editor from '../component/Editor';
import { Button, Col, Divider, Input, Row, Space } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom'; // 설치한 패키지
import '../scss/write.scss';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from '../state';
import WriteSetting from './WriteSetting';
import { AnimatePresence } from 'framer-motion';

export default function Write() {
  const { id: postId } = useParams();
  const dispatch = useDispatch();

  const tagRef = useRef(new Set());
  const navigate = useNavigate();
  const [currentTag, setCurrentTag] = useState('');
  const [hashtag, setHashtag] = useState([]);
  const [htmlContent, setHtmlContent] = useState(null);
  const [postName, setPostName] = useState(null);
  const sequence = useSelector(state => state.write.sequence);

  const [level, setLevel] = useState(0);

  const getHtmlContent = (htmlContent) => {
    setHtmlContent(htmlContent);
  }

  const goBlog = () => {
    navigate('/blog');
  };

  const submit = () => {
    insertHashTag();
    console.log(htmlContent, tagRef.current, postName)

    setLevel(1);
    dispatch(actions.setValue('postName', postName))
    dispatch(actions.setValue('postContent', htmlContent))
    dispatch(actions.setValue('hashtag', Array.from(tagRef.current)))
    console.log(htmlContent);
    console.log(htmlContent.match(/[^='/]*\.(gif|jpg|jpeg|bmp|svg)/g))
  }

  const insertHashTag = () => {
    if (currentTag != '' && !tagRef.current.has(currentTag)) {
      setHashtag([...hashtag, { key: currentTag, hashtagName: currentTag }]);
      tagRef.current.add(currentTag);
    }
    setCurrentTag('');
  }

  const getSequence = () => {
    const today = new Date(); // today 객체에 Date()의 결과를 넣어줬다
    const year = today.getFullYear()  //현재 년도
    const month = today.getMonth() + 1 // 현재 월
    const date = today.getDate() // 현제 날짜
    const hours = today.getHours() //현재 시간
    const minutes = today.getMinutes() //현재 분
    const seconds = today.getSeconds() //현재 분

    return `endia1@endia.me-${year}${month}${date}${hours}${minutes}${seconds}`
  }

  /* 시퀀스 생성 */
  useEffect(() => {
    console.log('호출')
    dispatch(actions.setValue('sequence', getSequence()));
  }, [dispatch]);

  return (
    <>
      <AnimatePresence>
        {level > 0 && (<WriteSetting setLevel={setLevel} />)}
      </AnimatePresence>
      <Content className="main-content main-writer" style={{ marginTop: 30, paddingBottom: '4rem' }}>
        <Input
          className='post-title'
          placeholder="제목를 입력하세요."
          value={postName}
          onChange={(e) => {
            setPostName(e.target.value);
          }}
        />
        <Divider />
        <Row>
          {hashtag && hashtag.map((item, i) => {
            return (
              <Col key={item.hashtagName}>
                <Button
                  key={item.hashtagName}
                  onClick={() => {
                    setHashtag(hashtag.filter(item => item.key !== item.hashtagName))
                    tagRef.current.delete(item.hashtagName);
                  }}
                  style={{ fontWeight: 700, marginRight: 10 }}
                  className='button-type-round button-color-normal'>{item.hashtagName}</Button>
              </Col>
            )
          })}
          <Col>
            <Input
              className='post-tag'
              placeholder="태그를 입력하세요."
              value={currentTag}
              onChange={(e) => {
                setCurrentTag(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  insertHashTag();
                }
              }}
            />
          </Col>
        </Row>
        <Divider />
        <Editor
          sequence={sequence}
          postId={postId}
          placeholder={'기록하고 싶은 이야기를 적어 보세요'}
          htmlContent={htmlContent}
          getHtmlContent={getHtmlContent}

        />
      </Content>
      <Footer className='main-footer'>
        <Row>
          <Col flex='auto'>
            <Button
              style={{ fontWeight: 700 }}
              className='button-border-hide button-type-round'
              icon={<ArrowLeftOutlined />}
              onClick={goBlog}
            >
              나가기

            </Button>
          </Col>
          <Col flex='168px'>
            <Space>
              <Button
                style={{ fontWeight: 700 }}
                className='button-border-hide button-type-round'
              >
                임시저장
              </Button>
              <Button
                onClick={submit}
                className='button-type-round button-color-reverse'
              >
                세부설정하기
              </Button>
            </Space>
          </Col>
        </Row>
      </Footer>
    </>
  )
}