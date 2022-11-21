import {
  AppstoreAddOutlined,
  ArrowLeftOutlined,
  GlobalOutlined,
  LockOutlined,
} from "@ant-design/icons";
import {
  Button,
  Col,
  Input,
  Radio,
  Row,
  Space,
  Typography,
  message,
  Upload,
  Modal,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import { Content, Footer } from "antd/lib/layout/layout";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ImageIcon } from "../../../common/component/Icon";
import { API_HOST } from "../../../common/constant";
import { actions } from "../state";

export default function WriteSetting({ setLevel }) {
  const dispatch = useDispatch();
  const [isSeriesADD, setIsSeriesADD] = useState(false);
  const [seriesInput, setSeriesInput] = useState(null);
  const [inputFocus, setInputFocus] = useState(false);
  const seriesList = useSelector((state) => state.write.seriesList);
  const [value, setValue] = useState(null);
  const [prev, setPrev] = useState("");
  const spanRefs = useRef({});
  const sequence = useSelector((state) => state.write.sequence);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(true);
  const [imageUrl, setImageUrl] = useState("");
  const [defaultFileList, setDefaultFileList] = useState([]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async () => {
    setPreviewOpen(true);
  };

  const handleChange = (info) => {
    console.log(info);
    if (info.file.status === "uploading") {
      setLoading(true);
      return;
    }
    if (info.file.status === "done") {
      // Get this url from response in real world.
      setImageUrl(`${API_HOST}/${info.file.response}`);
      setPreviewImage(`${API_HOST}/${info.file.response}`);
      setIsSuccess(true);
    } else {
      setImageUrl("");
      setPreviewImage("");
      setIsSuccess(false);
    }
    setLoading(false);
  };

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("You can only upload JPG/PNG file!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("Image must smaller than 2MB!");
    }
    return isJpgOrPng && isLt2M;
  };

  const uploadImage = async (options) => {
    const { onSuccess, onError, file } = options;
    const url = "http://localhost:3085/image";
    const method = "post";
    const fmData = new FormData();
    fmData.append("image", file);
    try {
      const res = await axios({
        url,
        method,
        data: fmData,
        withCredentials: true,
      });
      onSuccess("Ok");
      console.log("server res: ", res);
    } catch (err) {
      console.log("Eroor: ", err);
      const error = new Error("Some error");
      onError({ err });
    }
  };

  const handleOnChange = ({ file, fileList, event }) => {
    // console.log(file, fileList, event);
    //Using Hooks to update the state to the current filelist
    console.log(fileList);
    setDefaultFileList(fileList);
    //filelist - [{uid: "-1",url:'Some url to image'}]
  };

  const uploadButton = (
    <div>
      <p className="ant-upload-drag-icon">
        <ImageIcon style={{ height: 180, display: "block" }} />
      </p>
      <p>
        <Button
          style={{ marginBottom: 15 }}
          className="button-type-round button-color-normal button-size-large"
        >
          썸네일 업로드
        </Button>
      </p>
    </div>
  );

  const onChange = (target) => {
    setValue(target.target.value);
  };

  const addSeries = () => {
    if (seriesInput) {
      const selected = spanRefs?.current[seriesInput];
      if (!selected && seriesInput !== "") {
        dispatch(actions.fetchCreateSeries(seriesInput));
      } else {
        spanRefs.current[seriesInput].scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      }
      setValue(seriesInput);
    }
    setSeriesInput("");
    setPrev(seriesInput);
  };

  useEffect(() => {
    dispatch(actions.fetchAllSeries());
  }, [dispatch]);

  useEffect(() => {
    if (Object.keys(spanRefs).length !== 0 && prev) {
      if (spanRefs.current[prev]) {
        spanRefs.current[prev].scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      }
    }
  }, [seriesList]);

  return (
    <>
      <motion.div
        className="modal"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, transition: { duration: 0.15 } }}
      >
        <motion.div layoutId={`item-motion`}>
          <div className="content content-detail">
            <Content
              className={`main-content main-writer main-writer-detail ${
                isSeriesADD ? "isSeriesADD" : ""
              }`}
              style={{
                display: "flex",
                alignItems: "center",
                overflow: "hidden",
              }}
            >
              <Row
                className="sub-content"
                style={{
                  paddingTop: 15,
                  paddingBottom: 15,
                }}
              >
                <Col>
                  <Typography.Title level={3}>포스트 미리보기</Typography.Title>
                  <Upload
                    accept="image/*"
                    customRequest={uploadImage}
                    onChange={handleOnChange}
                    listType="picture-card"
                    defaultFileList={defaultFileList}
                    className="image-upload-grid"
                    onPreview={handlePreview}
                  >
                    {defaultFileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal
                    open={previewOpen}
                    title="미리보기"
                    footer={null}
                    onCancel={handleCancel}
                  >
                    <img
                      alt="example"
                      style={{
                        width: "100%",
                      }}
                      src={previewImage}
                    />
                  </Modal>
                  <Typography.Title level={3} style={{ marginTop: 30 }}>
                    제목
                  </Typography.Title>
                  <TextArea showCount maxLength={100} />
                </Col>
                <div className="vertical-line" />
                {!isSeriesADD && (
                  <Col>
                    <Typography.Title level={3}>공개 설정</Typography.Title>
                    <Radio.Group
                      defaultValue="a"
                      className="public-setting"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: 30,
                      }}
                    >
                      <Radio.Button
                        value="a"
                        style={{
                          width: 140,
                          height: 50,
                          display: "flex",
                          marginRight: 10,
                        }}
                      >
                        <GlobalOutlined /> 전체공개
                      </Radio.Button>
                      <Radio.Button
                        value="b"
                        style={{ width: 140, height: 50, display: "flex" }}
                      >
                        <LockOutlined /> 비공개
                      </Radio.Button>
                    </Radio.Group>
                    <Typography.Title level={3}>시리즈 설정</Typography.Title>
                    <Button
                      icon={<AppstoreAddOutlined />}
                      style={{
                        height: 50,
                        fontSize: 20,
                      }}
                      className="button-type-round width-full"
                      onClick={() => setIsSeriesADD(!isSeriesADD)}
                    >
                      시리즈에 추가하기
                    </Button>
                  </Col>
                )}
                {isSeriesADD && (
                  <Col style={{ display: "flex", flexDirection: "column" }}>
                    <Col
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "flex-start",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography.Title
                        level={3}
                        style={{ display: "inline", width: 120, fontSize: 20 }}
                      >
                        시리즈 설정
                      </Typography.Title>
                      <Space className="seriesTopButton">
                        <Button
                          style={{ fontWeight: 700 }}
                          className="button-border-hide button-type-round"
                          onClick={() => {
                            setSeriesInput("");
                            setIsSeriesADD(!isSeriesADD);
                          }}
                        >
                          취소
                        </Button>
                        <Button
                          disabled
                          className="button-type-round button-color-reverse"
                        >
                          선택하기
                        </Button>
                      </Space>
                    </Col>
                    <div
                      className="inputBox"
                      style={{ padding: 15, backgroundColor: "#f8f9fb" }}
                    >
                      <Input
                        onBlur={() => {
                          setInputFocus(!inputFocus);
                        }}
                        onFocus={() => {
                          setInputFocus(!inputFocus);
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            addSeries(); // Enter 입력이 되면 클릭 이벤트 실행
                          }
                        }}
                        style={{
                          border: 0,
                        }}
                        value={seriesInput}
                        onChange={(e) => {
                          setSeriesInput(e.target.value);
                        }}
                        placeholder="새로운 시리즈 이름을 입력하세요"
                      />
                      <AnimatePresence>
                        {inputFocus && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                          >
                            <motion.div layoutId={`button_1`}>
                              <Button
                                className="button-type-round button-color-reverse"
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
                          width: "100%",
                          maxHeight: 265,
                          overflow: "auto",
                        }}
                      >
                        <Space direction="vertical" style={{ width: "100%" }}>
                          {seriesList.map((item, index) => {
                            return (
                              <Radio.Button
                                style={{ width: "100%", borderRadius: 0 }}
                                key={item.seriesName}
                                value={item.seriesName}
                              >
                                {item.seriesName}
                                <span
                                  ref={(element) =>
                                    (spanRefs.current[item.seriesName] =
                                      element)
                                  }
                                />
                              </Radio.Button>
                            );
                          })}
                        </Space>
                      </Radio.Group>
                    )}
                    <Footer
                      className="seriesBottomButton"
                      style={{ backgroundColor: "white", marginTop: "auto" }}
                    >
                      <Space>
                        <Button
                          style={{ fontWeight: 700 }}
                          className="button-border-hide button-type-round"
                          onClick={() => {
                            setSeriesInput("");
                            setIsSeriesADD(!isSeriesADD);
                          }}
                        >
                          취소
                        </Button>
                        <Button
                          disabled
                          className="button-type-round button-color-reverse"
                        >
                          선택하기
                        </Button>
                      </Space>
                    </Footer>
                  </Col>
                )}
              </Row>
            </Content>
            <Footer className="main-footer">
              <Row>
                <Col flex="auto">
                  <Button
                    style={{ fontWeight: 700 }}
                    className="button-border-hide button-type-round"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => {
                      setLevel(0);
                    }}
                  >
                    나가기
                  </Button>
                </Col>
                <Col flex="168px">
                  <Space>
                    <Button
                      style={{ fontWeight: 700 }}
                      className="button-border-hide button-type-round"
                    >
                      임시저장
                    </Button>
                    <Button className="button-type-round button-color-reverse">
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
  );
}
