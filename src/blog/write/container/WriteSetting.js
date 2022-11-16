import { AppstoreAddOutlined, ArrowLeftOutlined, GlobalOutlined, LockOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Radio, Row, Space, Typography, Upload } from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Content, Footer } from "antd/lib/layout/layout";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageIcon } from "../../../common/component/Icon";
import { actions } from "../state";

export default function WriteSetting({ setLevel }) {
  const dispatch = useDispatch();
  const [isSeriesADD, setIsSeriesADD] = useState(false);
  const [seriesInput, setSeriesInput] = useState(null);
  const [inputFocus, setInputFocus] = useState(false);
  const seriesList = useSelector(state => state.write.seriesList);
  const [value, setValue] = useState(null);
  const [prev, setPrev] = useState('');
  const spanRefs = useRef({});

  const onChange = (target) => {
    setValue(target.target.value);
  }

  const addSeries = () => {
    if (seriesInput) {
      const selected = spanRefs?.current[seriesInput];
      if (!selected && seriesInput !== '') {
        dispatch(actions.fetchCreateSeries(seriesInput));
      } else {
        spanRefs.current[seriesInput].scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'center'
        });
      }
      setValue(seriesInput);
    }
    setSeriesInput('');
    setPrev(seriesInput);
  }

  useEffect(() => {
    dispatch(actions.fetchAllSeries());
  }, [dispatch])

  useEffect(() => {
    if (Object.keys(spanRefs).length !== 0 && prev) {
      if (spanRefs.current[prev]) {
        spanRefs.current[prev].scrollIntoView({
          behavior: 'auto',
          block: 'center',
          inline: 'center'
        });
      }
    }
  }, [seriesList])

  return (
    <>
      <motion.div
        className="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        <motion.div layoutId={`item-motion`}>
          <div className="content">
            <Content className="main-content main-writer" style={{ height: 'calc(100% - 52px)', display: "flex", alignItems: "center" }}>
              <Row className="sub-content">
                <Col>
                  <Typography.Title level={3}>포스트 미리보기</Typography.Title>
                  <Form>
                    <Form.Item name="dragger" valuePropName="fileList" getValueFromEvent={() => { }} noStyle>
                      <Upload.Dragger name="files" action="/upload.do">
                        <p className="ant-upload-drag-icon">
                          <ImageIcon style={{ height: 180, display: 'block' }} />
                          <Button
                            style={{ marginBottom: 15 }}
                            className='button-type-round button-color-normal button-size-large'
                          >
                            썸네일 업로드
                          </Button>
                        </p>
                      </Upload.Dragger>
                    </Form.Item>
                  </Form>
                  <Typography.Title level={3} style={{ marginTop: 30 }}>제목</Typography.Title>
                  <TextArea showCount maxLength={100} />
                </Col>
                <div className="vertical-line" />
                {!isSeriesADD && (
                  <Col>
                    <Typography.Title level={3}>공개 설정</Typography.Title>
                    <Radio.Group defaultValue="a" style={{
                      display: 'flex',
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingBottom: 30,
                    }}>
                      <Radio.Button value="a" style={{ width: 140, height: 50, display: 'flex' }}><GlobalOutlined /> 전체공개</Radio.Button>
                      <Radio.Button value="b" style={{ width: 140, height: 50, display: 'flex' }}><LockOutlined /> 비공개</Radio.Button>
                    </Radio.Group>
                    <Typography.Title level={3}>시리즈 설정</Typography.Title>
                    <Button
                      icon={<AppstoreAddOutlined />}
                      style={{
                        height: 50,
                        fontSize: 20
                      }}
                      className="button-type-round width-full"
                      onClick={() => setIsSeriesADD(!isSeriesADD)}
                    >시리즈에 추가하기</Button>
                  </Col>
                )}
                {isSeriesADD && (
                  <Col style={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography.Title level={3}>시리즈 설정</Typography.Title>
                    <div className="inputBox" style={{ padding: 15, backgroundColor: '#f8f9fb' }}>
                      <Input
                        onBlur={() => {
                          setInputFocus(!inputFocus);
                        }}
                        onFocus={() => {
                          setInputFocus(!inputFocus);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            addSeries(); // Enter 입력이 되면 클릭 이벤트 실행
                          }
                        }}
                        style={{
                          border: 0
                        }}
                        value={seriesInput}
                        onChange={(e) => {
                          setSeriesInput(e.target.value);
                        }}
                        placeholder="새로운 시리즈 이름을 입력하세요" />
                      <AnimatePresence>
                        {inputFocus && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div layoutId={`button_1`}>
                              <Button
                                className='button-type-round button-color-reverse'
                                onClick={addSeries}
                                style={{ marginTop: 20 }}
                              >
                                시리즈 추가
                              </Button>
                            </motion.div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                    {seriesList && (
                      <Radio.Group
                        className="series-group"
                        onChange={(target) => {
                          onChange(target);
                        }}
                        value={value}
                        style={{
                          width: '100%',
                          maxHeight: 265,
                          overflow: 'auto',
                        }}
                      >
                        <Space direction="vertical" style={{ width: '100%' }}>
                          {seriesList.map((item, index) => {
                            return (
                              <Radio.Button
                                style={{ width: '100%', borderRadius: 0 }}
                                key={item.seriesName}
                                value={item.seriesName}>
                                {item.seriesName}
                                <span ref={(element) => spanRefs.current[item.seriesName] = element} />
                              </Radio.Button >
                            )
                          })}
                        </Space>
                      </Radio.Group>
                    )}
                    <Footer style={{ backgroundColor: 'white', marginTop: 'auto' }}>
                      <Space>
                        <Button
                          style={{ fontWeight: 700 }}
                          className='button-border-hide button-type-round'
                          onClick={() => {
                            setSeriesInput('');
                            setIsSeriesADD(!isSeriesADD)
                          }}
                        >
                          취소
                        </Button>
                        <Button
                          disabled
                          className='button-type-round button-color-reverse'
                        >
                          선택하기
                        </Button>
                      </Space>
                    </Footer>
                  </Col>
                )}
              </Row>
            </Content>
            <Footer className='main-footer'>
              <Row>
                <Col flex='auto'>
                  <Button
                    style={{ fontWeight: 700 }}
                    className='button-border-hide button-type-round'
                    icon={<ArrowLeftOutlined />}
                    onClick={() => {
                      setLevel(0);
                    }}
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
                      className='button-type-round button-color-reverse'
                    >
                      출간하기
                    </Button>
                  </Space>
                </Col>
              </Row>
            </Footer>
          </div>
        </motion.div>{" "}
      </motion.div>
    </>
  )
};