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
import { ImageIcon } from "../../../common/components/Icon";
import { API_HOST, FetchStatus } from "../../../common/constant";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { actions, Types } from "../state";
import { useGoMain } from "../../../common/hook/useGoMain";
import { useFetchInfoDelete } from "../../../common/hook/useFetchInfoDelete";

export default function WriteSetting({
  setLevel,
  hashtag,
  postName,
  postPermission,
  series,
  postId,
}) {
  const dispatch = useDispatch();

  /* 메인 화면으로 이동하기 위한 콜백함수를 생성 */
  const goMain = useGoMain();

  /**
   * Create,Update Fetching 진행중 버튼클릭 제어 스위치
   */
  const isFetching = useSelector(state => state.write.isFetching);

  const [isSeriesADD, setIsSeriesADD] = useState(false);
  const [seriesInput, setSeriesInput] = useState(null);
  const [inputFocus, setInputFocus] = useState(false);
  const seriesList = useSelector((state) => state.write.seriesList);
  // 시리즈 Span 객체 참조
  const seriesRefs = useRef({});

  // 파일 프리뷰 팝업 오픈 제어
  const [previewOpen, setPreviewOpen] = useState(false);
  // 프리뷰 이미지 저장용
  const [previewImage, setPreviewImage] = useState(null);
  // 등록된 이미지가 있을경우(수정) 해당 이미지 썸네일 노출용
  const [defaultFileList, setDefaultFileList] = useState([]);

  const permission = useSelector(state => state.write.permission);
  const description = useSelector(state => state.write.postDescription);
  const seriesName = useSelector(state => state.write.seriesName);
  const seriesThumbnail = useSelector(state => state.write.seriesThumbnail);
  const imageList = useSelector(state => state.write.imageList);
  const thumbnail = useSelector(state => state.write.postThumbnail);
  const thumbnailId = useSelector(state => state.write.thumbnailId);
  const tempId = useSelector(state => state.write.tempId);
  const postContent = useSelector(state => state.write.postContent);

  // 시리즈 파일 프리뷰 팝업 오픈 제어
  const [seriesPreviewOpen, setSeriesPreviewOpen] = useState(false);
  // 시리즈 프리뷰 이미지 저장용
  const [seriesPreviewImage, setSeriesPreviewImage] = useState(null);
  // 등록된 시리즈 이미지가 있을경우(수정) 해당 이미지 썸네일 노출용
  const [defaultSeriesFileList, setDefaultSeriesFileList] = useState([]);

  const { fetchStatus: cfetchStatus } = useFetchInfo(Types.FetchCreatePost);
  const { fetchStatus: ufetchStatus } = useFetchInfo(Types.FetchUpdatePost);
  const { fetchStatus: tfetchStatus } = useFetchInfo(Types.FetchCreateTempPost);

  // 이미지 변경 시 seriesList에 변경된 이미지값을 추가해주기 위한 상태값
  const { fetchStatus: siFetchStatus } = useFetchInfo(Types.FetchCreateSeriesImage);
  // 이미지 삭제 시 seriesList에 변경된 이미지값을 삭제해주기 위한 상태값
  const { fetchStatus: dsiFetchStatus } = useFetchInfo(Types.FetchDeleteSeriesImage);
  /* 상태값 초기화 함수훅 생성 */
  const deleteStatusFunction = useFetchInfoDelete();

  /**
 * 메시지 그루핑 키
 */
  const key = "updatable";

  /**
   * 작성/수정 메시지 핸들링 함수
   */
  const openMessage = useCallback(
    (status) => {
      if (status === FetchStatus.Success) {
        message.success({
          content: "작성이 완료되었습니다",
          key,
          duration: 2,
        });
        setTimeout(() => {
          goMain();
        }, 500);
      } else if (status === FetchStatus.Success) {
        message.error({
          content: "작성 중 오류가 발생했습니다",
          key,
          duration: 2,
        });
      } else if (status === FetchStatus.Request) {
        message.loading({
          content: "처리중",
          key,
        });
      }
    },
    [goMain]
  );

  /**
   * 임시저장 메시지 핸들링 함수
   */
  const openTempMessage = useCallback(
    (status) => {
      if (status === FetchStatus.Success) {
        message.success({
          content: "임시저장이 완료되었습니다",
          key,
          duration: 2,
        });
        setTimeout(() => {
          goMain();
        }, 500);
      } else if (status === FetchStatus.Success) {
        message.error({
          content: "임시저장 중 오류가 발생했습니다",
          key,
          duration: 2,
        });
      } else if (status === FetchStatus.Request) {
        message.loading({
          content: "처리중",
          key,
        });
      }
    },
    [goMain]
  );

  /**
   * 세부설정하기 2회 진입부터 체크 ( 포스트 미리보기 )
   * -> 세부설정화면에서 본문작성화면을 갔다왔을 경우 세부설정정보 보존용
   */
  useEffect(() => {
    if (thumbnail && thumbnailId) {
      setDefaultFileList([{
        name: thumbnail,
        thumbUrl: `${API_HOST}/${thumbnail}`,
      }]);
      setPreviewImage({
        fileName: thumbnail,
        id: thumbnailId,
      });
    }
  }, [thumbnail, thumbnailId])

  /**
 * 세부설정하기 2회 진입부터 체크 ( 시리즈 미리보기 )
 * -> 세부설정화면에서 본문작성화면을 갔다왔을 경우 세부설정정보 보존용
 */
  useEffect(() => {
    if (seriesThumbnail) {
      setDefaultSeriesFileList([{
        name: seriesThumbnail,
        thumbUrl: `${API_HOST}/${seriesThumbnail}`,
      }]);
      setSeriesPreviewImage({
        fileName: seriesThumbnail,
        id: seriesThumbnail,
      });
    }
  }, [seriesThumbnail])

  /* 게시글 생성 메시지 핸들러 */
  useEffect(() => {
    openMessage(cfetchStatus);
  }, [cfetchStatus, openMessage]);

  /* 게시글 수정 메시지 핸들러 */
  useEffect(() => {
    openMessage(ufetchStatus);
  }, [ufetchStatus, openMessage]);

  /* 게시글 임시저장 메시지 헨들러*/
  useEffect(() => {
    openTempMessage(tfetchStatus);
  }, [tfetchStatus, openTempMessage]);

  /* 미리보기 팝업 취소 핸들링 */
  const handleCancel = () => setPreviewOpen(false);

  /* 미리보기 노출 여부 핸들링 */
  const handlePreview = async () => {
    setPreviewOpen(true);
  };

  /**
   * @description 이미지 업로드 유효성 체크
   * @param {object} file 
   * @returns 
   */
  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/jpg" || file.type === "image/png";
    if (!isJpgOrPng) {
      message.error("JPG/JPEG/PNG file만 업로드가 가능합니다!");
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("이미지 크기는 2MB까지만 허용됩니다!");
    }
    return isJpgOrPng && isLt2M;
  };

  /**
   * @description 이미지 선택시 업로드 핸들링
   * @param {object} options 
   */
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
    } catch (err) {
      console.debug("Error: ", err);
      onError({ err });
    }
  };

  /**
   * @description 이미지 업로드 콜백 함수
   * @param {object} param
   * @param {array} param.fileList
   */
  const handleOnChange = ({ fileList }) => {
    setDefaultFileList(fileList);
    setPreviewImage(fileList?.[0]?.response);
    dispatch(actions.setValue('postThumbnail', fileList?.[0]?.response?.fileName))
    if (fileList?.[0]?.response?.id) {
      dispatch(actions.setValue('thumbnailId', fileList?.[0]?.response?.id));
    }
  };


  /**
   * 이미지 삭제 핸들러
   */
  const handleOnRemove = () => {
    dispatch(actions.setValue('thumbnailId', ""));
  };

  /**
   * 등록된 썸네일이 없을 경우 노출되는 Component
   */
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

  /* 시리즈가 변경된 경우 핸들링 */
  const onSeriesChange = (target) => {
    dispatch(actions.setValue('seriesName', target.target.value));
    // 현재 선택된 시리즈 객체 조회
    const currentSeries = seriesList.filter(x => x.seriesName === target.target.value);
    // 썸네일 파일명을 저장
    dispatch(actions.setValue("seriesThumbnail", currentSeries?.[0]?.seriesThumbnail));
  };

  /* 시리즈 선택이 취소된 경우 핸들링 */
  const onSeriesCancel = () => {
    dispatch(actions.setValue('seriesName', null));
    dispatch(actions.setValue("seriesThumbnail", null));
  };

  /* 시리즈 입력 시 추가 로직 */
  const addSeries = () => {
    if (seriesInput) {
      // 등록하려는 시리즈 키가 맵에 있는지 확인
      const selected = seriesRefs?.current[seriesInput];
      // 맵에 해당 키가 없으면서 입력값이 공백이 아닌 경우 신규 시리즈 등록
      if (!selected && seriesInput !== "") {
        dispatch(actions.fetchCreateSeries(seriesInput));
      } else {
        // 기존에 등록되어있는 값인 경우 해당 값 위치로 스크롤 이동
        seriesRefs.current[seriesInput].scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      }
      // 현재 선택된 시리즈 이름을 업데이트
      dispatch(actions.setValue('seriesName', seriesInput));
    }
    // 시리즈 Input 박스를 비운다.
    setSeriesInput("");
  };

  /* 로드시 시리즈를 조회한다. */
  useEffect(() => {
    dispatch(actions.fetchAllSeries());
  }, [dispatch]);

  /* 시리즈를 선택할 경우 시리즈 미리보기을 변경한다. */
  useEffect(() => {
    // 현재 선택된 시리즈 객체 조회
    if (seriesThumbnail) {
      // 시리즈 파일 리스트 수정
      setDefaultSeriesFileList([{
        name: seriesThumbnail,
        thumbUrl: `${API_HOST}/${seriesThumbnail}`,
      }]);
      // 시리즈 미리보기 이미지 수정
      setSeriesPreviewImage({
        fileName: seriesThumbnail,
        id: seriesThumbnail,
      });
    } else {
      // 시리즈 파일 리스트 수정
      setDefaultSeriesFileList([]);
      // 시리즈 미리보기 이미지 수정
      setSeriesPreviewImage(null);
    }
  }, [dispatch, seriesThumbnail]);


  /* 시리즈 생성 시 스크롤을 해당 시리즈 위치로 이동시킨다. ( 생성 / 조회 시 실행 ) */
  useEffect(() => {
    if (Object.keys(seriesRefs).length !== 0 && seriesName) {
      if (seriesRefs.current[seriesName]) {
        seriesRefs.current[seriesName].scrollIntoView({
          behavior: "auto",
          block: "center",
          inline: "center",
        });
      }
    }
  }, [seriesList, seriesName]);

  /**
   * @description 시리즈 이미지 선택시 업로드 핸들링
   * @param {object} options 
   */
  const uploadSeriesImage = async (options) => {
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
      if (res.data) {
        // 이미지 업로드가 성공했을 경우 Series에 이미지 정보를 추가한다.
        dispatch(actions.fetchCreateSeriesImage({ imageId: res?.data?.id, fileName: res?.data?.fileName, seriesName }))
        // 썸네일 파일명을 저장
        dispatch(actions.setValue("seriesThumbnail", res?.data?.fileName));
      }
      onSuccess(res.data);
    } catch (err) {
      console.log("Error: ", err);
      onError({ err });
    }
  };

  /**
   * @description 시리즈 이미지 업로드 콜백 함수
   * @param {object} param
   * @param {array} param.fileList
   */
  const handleSeriesOnChange = ({ fileList }) => {
    setDefaultSeriesFileList(fileList);
    setSeriesPreviewImage(fileList?.[0]?.response);
  };

  /**
   * 시리즈 이미지 삭제 핸들러
   */
  const handleSeriesOnRemove = () => {
    dispatch(actions.fetchDeleteSeriesImage({ seriesName }));
  };

  /**
   * CreateSeriesImage 액션의 상태값이 변경될 경우 SeriesList의 썸네일 경로를 업데이트
   */
  useEffect(() => {
    if (siFetchStatus === FetchStatus.Success) {
      const currentSeries = seriesList.filter(x => x.seriesName === seriesName);
      const excludeList = seriesList.filter(x => x.seriesName !== seriesName);
      const updateSeries = [{
        id: currentSeries[0].id,
        seriesName: currentSeries[0].seriesName,
        seriesThumbnail: seriesThumbnail
      }]
      dispatch(actions.setValue("seriesList", [...excludeList, ...updateSeries]));
      deleteStatusFunction(Types.FetchCreateSeriesImage);
    }
  }, [dispatch, siFetchStatus, deleteStatusFunction, seriesList, seriesName, seriesThumbnail])

  /**
  * fetchDeleteSeriesImage 액션의 상태값이 변경될 경우 SeriesList의 썸네일 경로를 업데이트
  */
  useEffect(() => {
    if (dsiFetchStatus === FetchStatus.Success) {
      const currentSeries = seriesList.filter(x => x.seriesName === seriesName);
      const excludeList = seriesList.filter(x => x.seriesName !== seriesName);
      const updateSeries = [{
        id: currentSeries[0].id,
        seriesName: currentSeries[0].seriesName,
        seriesThumbnail: null
      }]
      dispatch(actions.setValue("seriesList", [...excludeList, ...updateSeries]));
      deleteStatusFunction(Types.FetchDeleteSeriesImage);
    }
  }, [dispatch, dsiFetchStatus, deleteStatusFunction, seriesList, seriesName, seriesThumbnail])

  /* 미리보기 팝업 취소 핸들링 */
  const handleSeriesCancel = () => setSeriesPreviewOpen(false);

  /* 미리보기 노출 여부 핸들링 */
  const handleSeriesPreview = async () => {
    setSeriesPreviewOpen(true);
  };

  /**
   * @description 게시글 임시저장
   * @param {object} param
   * @param {string=} param.description // 게시글 설명
   * @param {string=} param.permission  // 공개여부
   * @param {string=} param.seriesName  // 시리즈이름
   */
  function tempSubmit({ description, permission, seriesName }) {
    // 임시저장, 나가기, 출간하기 버튼 비활성화
    dispatch(actions.setValue("isFetching", true));

    let imageIds = [];
    let hashtags = [];
    // 이미지 리스트에 저장된 값을 ImageIds에 복사
    if (imageList?.length > 0) {
      imageIds = [...imageList];
    }
    // 썸네일 이미지가 있을 경우 ImageIds에 추가
    if (thumbnailId) {
      imageIds.push(thumbnailId);
    }
    // 등록할 해시태그가 있는 경우 hashtags에 추가
    if (hashtag) {
      hashtag.map((item) => {
        return hashtags.push(item.key);
      });
    }
    // 임시등록 액션 호출
    dispatch(
      actions.fetchCreateTempPost({
        postId: postId,
        postName: postName,
        hashtags: hashtags,
        postDescription: description,
        postContent: postContent,
        postThumbnail: `${thumbnail ?? null}`,
        permission: permission,
        seriesName: seriesName,
        imageIds: imageIds,
      })
    );
  }

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
              className={`main-content main-writer main-writer-detail ${isSeriesADD ? "isSeriesADD" : ""
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
                  <Typography.Title level={3} className="menu-label">포스트 미리보기</Typography.Title>
                  <Upload
                    accept="image/*"
                    customRequest={uploadImage}
                    onChange={handleOnChange}
                    listType="picture-card"
                    fileList={defaultFileList}
                    className="image-upload-grid"
                    onPreview={handlePreview}
                    beforeUpload={beforeUpload}
                    onRemove={handleOnRemove}
                  >
                    {defaultFileList.length >= 1 ? null : uploadButton}
                  </Upload>
                  <Modal
                    open={previewOpen}
                    title="포스트 미리보기"
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
                  <Typography.Title level={3} style={{ marginTop: 30 }} className="menu-label">
                    포스트 설명
                  </Typography.Title>
                  <TextArea
                    defaultValue={description}
                    showCount
                    maxLength={100}
                    onChange={(e) => {
                      dispatch(actions.setValue('postDescription', e.target.value))
                    }}
                  />
                </Col>
                <div className="vertical-line" />
                {!isSeriesADD && (
                  <Col>
                    <Typography.Title level={3} className="menu-label">공개 설정</Typography.Title>
                    <Radio.Group
                      defaultValue={postPermission ?? 'public'}
                      onChange={(e) => {
                        dispatch(actions.setValue('permission', e.target.value));
                      }}
                      value={permission}
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
                    {!seriesName && (
                      <>
                        <Typography.Title level={3} className="menu-label">
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
                    {seriesName && (
                      <>
                        <Typography.Title level={3} style={{ paddingBottom: 10, }}>
                          시리즈 설정
                        </Typography.Title>
                        <Input.Group compact>
                          <Input
                            className="seires-input-selected"
                            disabled
                            value={seriesName}
                            addonAfter={
                              <Button
                                className="seires-button-selected"
                                icon={<SettingOutlined />}
                                onClick={() => {
                                  setIsSeriesADD(!isSeriesADD);
                                  setSeriesInput("");
                                  dispatch(actions.setValue('seriesName', null));
                                }}
                              />
                            }
                          />
                        </Input.Group>
                        <Typography.Title level={3} style={{ paddingBottom: 10, paddingTop: 10 }}>
                          시리즈 미리보기
                        </Typography.Title>
                        <Upload
                          accept="image/*"
                          customRequest={uploadSeriesImage}
                          onChange={handleSeriesOnChange}
                          listType="picture-card"
                          fileList={defaultSeriesFileList}
                          className="image-upload-grid"
                          onPreview={handleSeriesPreview}
                          beforeUpload={beforeUpload}
                          onRemove={handleSeriesOnRemove}
                        >
                          {defaultSeriesFileList.length >= 1 ? null : uploadButton}
                        </Upload>
                        <Modal
                          open={seriesPreviewOpen}
                          title="시리즈 미리보기"
                          footer={null}
                          onCancel={handleSeriesCancel}
                        >
                          <img
                            alt="example"
                            style={{
                              width: "100%",
                            }}
                            src={`${API_HOST}/${seriesPreviewImage?.fileName}`}
                          />
                        </Modal>
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
                          disabled={!seriesName}
                          className="button-type-round button-color-reverse"
                          onClick={() => {
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
                        value={seriesName}
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
                                  (seriesRefs.current[item.seriesName] =
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
                          disabled={!seriesName}
                          className="button-type-round button-color-reverse"
                          onClick={() => {
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
                      onClick={() => {
                        // 임시저장, 나가기, 출간하기 버튼 비활성화
                        dispatch(actions.setValue("isFetching", true));
                        tempSubmit({ description, permission, seriesName })
                      }
                      }
                    >
                      임시저장
                    </Button>
                    <Button
                      className="button-type-round button-color-reverse"
                      disabled={isFetching}
                      onClick={() => {
                        // 임시저장, 나가기, 출간하기 버튼 비활성화
                        dispatch(actions.setValue("isFetching", true));
                        let imageIds = [];
                        let hashtags = [];
                        if (imageList?.length > 0) {
                          imageIds = [...imageList];
                        }
                        if (previewImage) {
                          imageIds.push(thumbnailId);
                        }
                        if (hashtag) {
                          hashtag.map((item) => {
                            return hashtags.push(item.key);
                          });
                        }
                        if (postId) {
                          dispatch(
                            actions.fetchUpdatePost({
                              postId: postId,
                              postName: postName,
                              hashtags: hashtags,
                              postDescription: description,
                              postContent: postContent,
                              postThumbnail: `${previewImage?.fileName ?? ''}`,
                              permission: permission,
                              seriesOriId: series?.id,
                              seriesOriName: series?.seriesName,
                              seriesName: seriesName,
                              imageIds: imageIds,
                              tempId: tempId,
                            })
                          );
                        } else {
                          dispatch(
                            actions.fetchCreatePost({
                              postName: postName,
                              hashtags: hashtags,
                              postDescription: description,
                              postContent: postContent,
                              postThumbnail: `${previewImage?.fileName ?? null}`,
                              permission: permission,
                              seriesName: seriesName,
                              imageIds: imageIds,
                              tempId: tempId,
                            })
                          );
                        }
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
