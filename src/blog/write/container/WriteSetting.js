import {
  AppstoreAddOutlined,
  ArrowLeftOutlined,
  GlobalOutlined,
  LockOutlined,
  SettingOutlined,
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
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ImageIcon } from "../../../common/component/Icon";
import { API_HOST, FetchStatus } from "../../../common/constant";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";
import { actions as common } from "../../../common/state";
import { Types as mainType } from "../../main/state";

export default function WriteSetting({
  setLevel,
  hashtag,
  postContent,
  postName,
  postImages,
}) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const goBlog = useCallback(() => {
    navigate("/blog");
  }, [navigate]);

  const [isSeriesADD, setIsSeriesADD] = useState(false);
  const [seriesInput, setSeriesInput] = useState(null);
  const [inputFocus, setInputFocus] = useState(false);
  const seriesList = useSelector((state) => state.write.seriesList);
  const [value, setValue] = useState(null);
  const [seriesSelectYsno, setSeriesSelectYsno] = useState(false);
  const [prev, setPrev] = useState("");
  const spanRefs = useRef({});
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  const [defaultFileList, setDefaultFileList] = useState([]);
  const [permission, setPermission] = useState("public");
  const [description, setDescription] = useState("");

  const { fetchStatus, isFetching } = useFetchInfo(Types.FetchCreatePost);
  const key = "updatable";

  const deleteStatus = useCallback(
    (fetchKey, actionType) => {
      if (!fetchKey) fetchKey = actionType;
      const params = {
        actionType,
        fetchKey,
        status: FetchStatus.Delete,
      };
      dispatch(common.setFetchStatus(params));
    },
    [dispatch]
  );

  const openMessage = useCallback(
    (fetchStatus) => {
      if (fetchStatus === FetchStatus.Success) {
        message.success({
          content: "작성이 완료되었습니다",
          key,
          duration: 2,
        });
        setTimeout(() => {
          deleteStatus(Types.FetchCreatePost);
          deleteStatus(mainType.FetchAllPost);
          deleteStatus(mainType.FetchAllHashtag);
          deleteStatus(mainType.FetchAllSeries);
          goBlog();
        }, 2000);
      } else if (fetchStatus === FetchStatus.Success) {
        message.error({
          content: "작성 중 오류가 발생했습니다",
          key,
          duration: 2,
        });
      } else if (fetchStatus === FetchStatus.Request) {
        message.loading({
          content: "처리중",
          key,
        });
      }
    },
    [deleteStatus, goBlog]
  );

  useEffect(() => {
    if (fetchStatus === FetchStatus.Request) {
      openMessage(fetchStatus);
    }
    if (fetchStatus !== FetchStatus.Request) {
      openMessage(fetchStatus);
    }
  }, [fetchStatus, openMessage]);

  const handleCancel = () => setPreviewOpen(false);

  const handlePreview = async () => {
    setPreviewOpen(true);
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
    const url = `${API_HOST}/image`;
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
      onSuccess(res.data);
      console.log("server res: ", res);
    } catch (err) {
      console.log("Eroor: ", err);
      onError({ err });
    }
  };

  const handleOnChange = ({ file, fileList, event }) => {
    setDefaultFileList(fileList);
    setPreviewImage(fileList?.[0]?.response);
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

  const onSeriesChange = (target) => {
    setValue(target.target.value);
  };

  const onSeriesCancel = () => {
    setValue(null);
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
  }, [seriesList, prev]);

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
                overflowY: "auto",
              }}
            >
              <Row
                className="sub-content"
                style={{
                  paddingTop: 15,
                  paddingBottom: 15,
                  overflow: "hidden",
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
                    beforeUpload={beforeUpload}
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
                      src={`${API_HOST}/${previewImage?.fileName}`}
                    />
                  </Modal>
                  <Typography.Title level={3} style={{ marginTop: 30 }}>
                    포스트 설명
                  </Typography.Title>
                  <TextArea
                    showCount
                    maxLength={100}
                    onChange={(e) => {
                      setDescription(e.target.value);
                    }}
                  />
                </Col>
                <div className="vertical-line" />
                {!isSeriesADD && (
                  <Col>
                    <Typography.Title level={3}>공개 설정</Typography.Title>
                    <Radio.Group
                      defaultValue="public"
                      onChange={(e) => {
                        setPermission(e.target.value);
                      }}
                      className="permission"
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        paddingBottom: 30,
                      }}
                    >
                      <Radio.Button
                        value="public"
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
                        value="private"
                        style={{ width: 140, height: 50, display: "flex" }}
                      >
                        <LockOutlined /> 비공개
                      </Radio.Button>
                    </Radio.Group>
                    {!seriesSelectYsno && (
                      <>
                        <Typography.Title level={3}>
                          시리즈 설정
                        </Typography.Title>
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
                      </>
                    )}
                    {seriesSelectYsno && (
                      <>
                        <Typography.Title level={3}>
                          시리즈 설정
                        </Typography.Title>
                        <Input.Group compact>
                          <Input
                            className="seires-input-selected"
                            disabled
                            value={value}
                            addonAfter={
                              <Button
                                className="seires-button-selected"
                                icon={<SettingOutlined />}
                                onClick={() => {
                                  setIsSeriesADD(!isSeriesADD);
                                  setSeriesSelectYsno(!seriesSelectYsno);
                                  setSeriesInput("");
                                  setValue(null);
                                }}
                              />
                            }
                          />
                        </Input.Group>
                      </>
                    )}
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
                            onSeriesCancel();
                          }}
                        >
                          취소
                        </Button>
                        <Button
                          disabled={!value}
                          className="button-type-round button-color-reverse"
                          onClick={() => {
                            setSeriesSelectYsno(true);
                            setIsSeriesADD(!isSeriesADD);
                          }}
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
                          onSeriesChange(target);
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
                      style={{
                        backgroundColor: "white",
                        marginTop: "auto",
                      }}
                    >
                      <Space>
                        <Button
                          style={{ fontWeight: 700 }}
                          className="button-border-hide button-type-round"
                          onClick={() => {
                            setSeriesInput("");
                            setIsSeriesADD(!isSeriesADD);
                            onSeriesCancel();
                          }}
                        >
                          취소
                        </Button>
                        <Button
                          disabled={!value}
                          className="button-type-round button-color-reverse"
                          onClick={() => {
                            setSeriesSelectYsno(true);
                            setIsSeriesADD(!isSeriesADD);
                          }}
                        >
                          선택하기
                        </Button>
                      </Space>
                    </Footer>
                  </Col>
                )}
              </Row>
            </Content>
            <Footer className="main-footer" style={{ zIndex: 1 }}>
              <Row>
                <Col flex="auto">
                  <Button
                    style={{ fontWeight: 700 }}
                    className="button-border-hide button-type-round"
                    icon={<ArrowLeftOutlined />}
                    disabled={isFetching}
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
                      disabled={isFetching}
                    >
                      임시저장
                    </Button>
                    <Button
                      className="button-type-round button-color-reverse"
                      disabled={isFetching}
                      onClick={() => {
                        let imageIds = [];
                        let hashtags = [];
                        if (postImages) {
                          imageIds = [...postImages];
                        }
                        if (previewImage) {
                          imageIds.push(previewImage.id);
                        }
                        if (hashtag) {
                          hashtag.map((item) => {
                            return hashtags.push(item.key);
                          });
                        }
                        dispatch(
                          actions.fetchCreatePost({
                            postName: postName,
                            hashtags: hashtags,
                            postDescription: description,
                            postContent: postContent,
                            postThumnail: `${previewImage?.fileName ?? null}`,
                            permission: permission,
                            seriesName: value,
                            imageIds: imageIds,
                          })
                        );
                      }}
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
  );
}
