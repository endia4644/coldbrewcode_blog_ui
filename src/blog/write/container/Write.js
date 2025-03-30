import React, { useCallback, useEffect, useRef, useState } from "react";
import { Content, Footer } from "antd/lib/layout/layout";
import "react-quill/dist/quill.snow.css";
import Editor from "../components/CKEditor";
import { Button, Col, Divider, Input, message, Modal, Row, Space, Typography } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useParams } from "react-router-dom";
import "../scss/write.scss";
import { useDispatch, useSelector } from "react-redux";
import { actions, INITINAL_STATE, Types } from "../state";
import WriteSetting from "./WriteSetting";
import { AnimatePresence } from "framer-motion";
import useNeedLogin from "../../../common/hook/useNeedLogin";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { FetchStatus } from "../../../common/constant";
import { useCallbackPrompt } from "../../../common/hook/useCallbackPrompt";
import { useFetchInfoDelete } from "../../../common/hook/useFetchInfoDelete";
import { useGoMain } from "../../../common/hook/useGoMain";

export default function Write() {
  // 로그인필수화면 - 로그인 여부 검사
  useNeedLogin();

  /**
 * Create,Update Fetching 진행중 버튼클릭 제어 스위치
 */
  const isFetching = useSelector(state => state.write.isFetching);

  /* 메인 화면으로 이동하기 위한 콜백함수를 생성 */
  const goMain = useGoMain();

  const { id: postId } = useParams();
  const dispatch = useDispatch();

  const tagRef = useRef(new Set());
  const imageMap = useRef(new Map());
  const [currentTag, setCurrentTag] = useState("");
  const [hashtag, setHashtag] = useState([]);
  const [htmlContent, setHtmlContent] = useState(null);
  const [tempHtmlContent, setTempHtmlContent] = useState(null);
  const [postName, setPostName] = useState(null);
  const post = useSelector(state => state.write.post);
  const thumbnail = useSelector(state => state.write.postThumbnail);
  const thumbnailId = useSelector(state => state.write.thumbnailId);
  const imageList = useSelector(state => state.write.imageList);
  const permission = useSelector(state => state.write.permission);
  const description = useSelector(state => state.write.postDescription);
  const seriesName = useSelector(state => state.write.seriesName);
  const postType = useSelector(state => state.write.postType);
  const tempId = useSelector(state => state.write.tempId);

  const [showPrompt, confirmNavigation, cancelNavigation] = useCallbackPrompt(true);

  const { fetchStatus: tfetchStatus } = useFetchInfo(Types.FetchCreateTempPost);

  /**
   * 목차의 계층구조를 만들기 위하여 사용되는 값
   */
  const [level, setLevel] = useState(0);

  /**
   * 작성취소 모달 오픈 여부 제어값
   */
  const [open, setOpen] = useState(false);

  /* 임시글 불러오기 모달 오픈 핸들링 */
  const showModal = () => {
    setOpen(true);
  };
  /**
   * 임시 글 불러오기 동의 버튼 헨들링
   */
  const handleOk = () => {
    dispatch(actions.fetchTempPost({ postId: post?.id, id: post?.TempPostId }));
    dispatch(actions.setValue("postType", "temp"));
    dispatch(actions.setValue("tempId", post?.TempPostId));
    setOpen(false);
  };

  /**
   * 임시 글 불러오기 취소 버튼 헨들링
   */
  const handleCancel = () => {
    setOpen(false);
  };

  /**
   * 임시 글 불러오기 삭제 버튼 헨들링
   */
  const handleRemove = () => {
    dispatch(actions.fetchDeleteTempPost({ id: post?.TempPostId }))
    setOpen(false);
  };

  /**
   * 나가기 시 임시 글 삭제
   */
  const handleTempRemove = () => {
    if(post?.TempPostId !== undefined && !post?.TempPostId) {
      dispatch(actions.fetchDeleteTempPost({ id: tempId }))
      setOpen(false);
    }
  };

  /* 상태값 초기화 함수훅 생성 */
  const deleteStatusFunction = useFetchInfoDelete();

  /**
   * 게시글 수정 초기화 로직
   */
  useEffect(() => {
    // 게시글 ID가 스토어에 없는경우 신규등록|임시저장 불러오기 이므로 종료
    if (!postId) {
      return;
    }
    // id 값으로 게시글 상세조회 액션 호출
    dispatch(actions.fetchPost({ id: postId }));
  }, [postId, dispatch]);

  /**
   * 게시글 수정 시 - 해당 게시글의 임시저장되어있는 글이 있을 경우 임시저장 팝업 호출
   */
  useEffect(() => {
    // 게시글 정보가 존재해야 함
    if (!post) {
      return;
    }
    // 임시저장된 게시글 정보가 존재해야 함
    if (!post?.TempPostId) {
      return;
    }
    // 둘다 만족할 경우 임시저장 팝업 호출
    showModal();
  }, [post, dispatch]);

  /* 수정/임시저장 게시글을 불러왔을 경우 초기화 로직 */
  useEffect(() => {
    // 게시글 정보가 스토어에 없는 경우 신규등록 이므로 종료
    if (!post) {
      return;
    }
    setPostName(post?.postName);
    if(post?.Hashtags) {
      setHashtag(post?.Hashtags ?? []);
    }
    if(post?.TempHashtags) {
      setHashtag(post?.TempHashtags ?? []);
    }

    /* 해시태그값 세팅 */
    post?.Hashtags?.map(item => tagRef.current.add(item.key));

    /* 필수값 세팅 */
    dispatch(actions.setValue('postName', post?.postName));
    dispatch(actions.setValue('postContent', post?.postContent));
    dispatch(actions.setValue('hashtag', post?.Hashtags));
    dispatch(actions.setValue('postDescription', post?.postDescription));
    dispatch(actions.setValue('postThumbnail', post?.postThumbnail));
    dispatch(actions.setValue('thumbnailId', post?.postThumbnailId));
    dispatch(actions.setValue('permission', post?.permission));
    dispatch(actions.setValue('seriesName', post?.Series?.[0]?.seriesName));
    dispatch(actions.setValue('seriesThumbnail', post?.Series?.[0]?.seriesThumbnail));
    dispatch(actions.setValue('seriesList', post?.Series));
  }, [post, dispatch]);

  /* 5분 마다 상태 체크 */
  useEffect(() => {
    if(tempHtmlContent !== null && tempHtmlContent !== undefined && tempHtmlContent !== '') {
      tempSubmit({ description, permission, seriesName, continueYsno: true });
    }
  }, [tempHtmlContent])

  /**
   * CKEditor 객체에게 setContent함수 전달
   * -> CKEditor는 blur 이벤트가 발생 시 부모에게 받은 setContent를 호출한다.
   * @param {string} htmlContent 
   */
  const getHtmlContent = (htmlContent) => {
    setHtmlContent(htmlContent);
  };

  /**
   * CKEditor 객체에게 setContent함수 전달
   * -> CKEditor는 5분마다 부모에게 받은 setContent를 호출한다.
   * @param {string} tempHtmlContent 
   */
  const getTempHtmlContent = (tempHtmlContent) => {
    setTempHtmlContent(tempHtmlContent);
  };

  /**
   * 게시글 메인정보 저장
   * -> 게시글 이름, 게시글내용, 해시태그 정보를 스토어에 저장한다.
   */
  const detailSetting = () => {
    const images = [];
    /* 현재 입력중이면서 저장하지 않은 정보로 태그로 변환 */
    insertHashTag();

    let content = contentAddIndex(htmlContent);

    setLevel(1);
    // 메인 정보를 스토어에 저장 : 제목, 본문, 해시태그
    dispatch(actions.setValue("postName", postName));
    dispatch(actions.setValue("postContent", content));
    dispatch(actions.setValue("hashtag", Array.from(tagRef.current)));
    // 본문의 이미지 정보를 이미지맵에 저장 -> 여기서 저장된 이미지 값 + 썸네일 이미지를 합쳐서 저장
    htmlContent?.match(/[^='/]*\.(gif|jpg|jpeg|bmp|svg|png)/g)?.map((item) => {
      if (imageMap.current.get(item)) {
        return images.push(imageMap.current.get(item));
      } else {
        return false;
      }
    });
    // 이미지가 1개 이상일 경우 이미지목록을 스토어에 저장
    if (images?.length > 0) {
      dispatch(actions.setValue('imageList', [...images]))
    }
  };

  /**
   * @description 해시태그 저장함수 - 저장하려는 해시태그가 Set내에 없을 경우 저장
   */
  const insertHashTag = () => {
    if (currentTag !== "" && !tagRef.current.has(currentTag)) {
      setHashtag([...hashtag, { key: currentTag, hashtagName: currentTag }]);
      tagRef.current.add(currentTag);
    }
    setCurrentTag("");
  };

  /**
   * 메시지 그루핑 키
   */
  const key = "updatable";

  /**
   * 임시저장 메시지 핸들링 함수
   */
  const openTempMessage = useCallback(
    (status) => {
      if (status === FetchStatus.Success) {
        message.success({
          content: "임시저장이 완료되었습니다",
          key,
          duration: 1,
        });
        setTimeout(() => {
          goMain();
        }, 500);
      } else if (status === FetchStatus.Fail) {
        message.error({
          content: "임시저장 중 오류가 발생했습니다",
          key,
          duration: 1,
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

  /* 
    헤더 태그에 적용 가능한 클래스 리스트
  */
  const HClass = [
    'underline'
  ]

  /**
   * @description 목차 구조를 생성하는 함수 - 본문 내의 해드 태그들의 구조를 변경한다.
   * @param {string} htmlContent 
   * @returns 
   */
  function contentAddIndex(htmlContent) {
    const regEx = /(<h[1-5](.*?)>)(.*?)(<\/h[1-5]>)/gm;
    const splitEx = /(<h[1-5])/g;
    const classEx = /(?<=class=")[^"]*(?=")/g;
    const contentEx = /(?<=<h[1-5](.*?)>)(.*?)(?=<\/h[1-5]>)/g;
    let id = 0;
    let contents = htmlContent;
    const htags = contents?.match(regEx);
    htags?.map(tag => {
      let newHeader = '';
      let tagHeader = tag.trim().split(splitEx);
      let className = "";
      if(tag?.match(classEx)) {
        let classList = tag?.match(classEx)[0].split(" "); // 공백을 기준으로 클래스 분리
        for(let i = 0 ; i < classList.length; i++) {
          if(HClass.includes(classList[i])) {
            className += classList[i] + " ";
          }
        }
      }
      let content = tag?.match(contentEx);
      switch (tagHeader?.[1]) {
        case "<h1": newHeader = `<h1 class="level1 ${className ? className : ''}" id="tag-${id}">${content[0]}</h1>`; break;
        case "<h2": newHeader = `<h2 class="level2 ${className ? className : ''}" id="tag-${id}">${content[0]}</h2>`; break;
        case "<h3": newHeader = `<h3 class="level3 ${className ? className : ''}" id="tag-${id}">${content[0]}</h3>`; break;
        case "<h4": newHeader = `<h4 class="level4 ${className ? className : ''}" id="tag-${id}">${content[0]}</h4>`; break;
        case "<h5": newHeader = `<h5 class="level5 ${className ? className : ''}" id="tag-${id}">${content[0]}</h5>`; break;
        default: break;
      }
      id++;
      return contents = contents?.replace(tag, newHeader);
    })

    return contents;
  }

  /**
   * @description 게시글 임시저장
   * @param {object} param
   * @param {string=} param.description   // 게시글 설명
   * @param {string=} param.permission    // 공개여부
   * @param {string=} param.seriesName    // 시리즈이름
   * @param {boolean=} param.continueYsno // 임시저장 종료여부
   */
  function tempSubmit({ description, permission, seriesName, continueYsno }) {
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
    // 본문 내용중 해드 태그를 목차 등록 가능한 구조로 치환하여 리턴
    let content = contentAddIndex(htmlContent);
    // 임시등록 액션 호출
    if(!continueYsno) {
      dispatch(
        actions.fetchCreateTempPost({
          postId: postId,
          tempId: tempId,
          postName: postName,
          hashtags: hashtags,
          postDescription: description,
          postContent: content,
          postThumbnail: `${thumbnail ?? null}`,
          permission: permission,
          seriesName: seriesName,
          imageIds: imageIds,
        })
      );
    } else {
      dispatch(
        actions.fetchCreateTempPostContinue({
          postId: postId,
          tempId: tempId,
          postName: postName,
          hashtags: hashtags,
          postDescription: description,
          postContent: content,
          postThumbnail: `${thumbnail ?? null}`,
          permission: permission,
          seriesName: seriesName,
          imageIds: imageIds,
        })
      );
    }
  }



  /**
   * 임시 저장 메시지 처리
   */
  useEffect(() => {
    // 수정이 아니고, 임시저장
    openTempMessage(tfetchStatus);
  }, [tfetchStatus, openTempMessage]);

  /**
   * 언마운트 처리 로직
   * 언마운트 시 INITINAL_STATE 초기화 
   * 언마운트 시 작성/수정/임시저장 액션 상태를 초기화
   */
  useEffect(() => {
    return () => {
      // 게시글 작성의 INITINAL_STATE 초기화
      for (const [key, value] of Object.entries(INITINAL_STATE)) {
        dispatch(actions.setValue(key, value));
      }
      // 언마운트 시 작성/수정/임시저장 액션 상태를 초기화
      deleteStatusFunction(Types.FetchCreateTempPost);
      deleteStatusFunction(Types.FetchCreatePost);
      deleteStatusFunction(Types.FetchUpdatePost);


    }
  }, [dispatch, deleteStatusFunction])

  return (
    <>
      <Modal
        title="작성 취소"
        open={showPrompt ? true : false}
        onOk={() => {
          if(tempId) {
            handleTempRemove(); 
          }
          // @ts-ignore
          confirmNavigation();
        }}
        onCancel={() => {
          // @ts-ignore
          cancelNavigation();
        }}
      >
        <Typography.Text>작성중인 내용이 저장되지 않았습니다.<br />작성을 그만두시겠습니까?</Typography.Text>
      </Modal>
      <AnimatePresence>
        {level > 0 && (
          <WriteSetting
            setLevel={setLevel}
            hashtag={hashtag}
            postName={postName}
            postPermission={post?.permission}
            series={post?.Series?.[0]}
            postId={postId}
          />
        )}
      </AnimatePresence>
      <Content
        className="main-content main-writer"
        style={{ marginTop: 30, paddingBottom: "4rem" }}
      >
        <Input
          className="post-title"
          placeholder="제목를 입력하세요."
          value={postName}
          onChange={(e) => {
            setPostName(e.target.value);
          }}
        />
        <Divider />
        <Row>
          {hashtag &&
            hashtag.map((item, i) => {
              return (
                <Col key={item.hashtagName}>
                  <Button
                    key={item.hashtagName}
                    data-hashtag={item.hashtagName}
                    onClick={() => {
                      setHashtag(
                        hashtag.filter((tag) => {
                          return item.key !== tag.hashtagName;
                        })
                      );
                      tagRef.current.delete(item.hashtagName);
                    }}
                    style={{ fontWeight: 700, marginRight: 10 }}
                    className="button-type-round button-color-normal"
                  >
                    {item.hashtagName}
                  </Button>
                </Col>
              );
            })}
          <Col>
            <Input
              className="post-tag"
              placeholder="태그를 입력하세요."
              value={currentTag}
              onChange={(e) => {
                setCurrentTag(e.target.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  insertHashTag();
                }
              }}
            />
          </Col>
        </Row>
        <Divider />
        <Editor
          postType={postType}
          postId={postType !== 'temp' ? postId : tempId}
          placeholder={"기록하고 싶은 이야기를 적어 보세요"}
          htmlContent={htmlContent}
          getHtmlContent={getHtmlContent}
          getTempHtmlContent={getTempHtmlContent}
          imageMap={imageMap}
        />
      </Content>
      <Footer className="main-footer">
        <Row>
          <Col flex="auto">
            <Button
              style={{ fontWeight: 700 }}
              className="button-border-hide button-type-round"
              icon={<ArrowLeftOutlined />}
              onClick={() => {
                goMain();
              }}
              disabled={isFetching}
            >
              나가기
            </Button>
          </Col>
          <Col flex="168px">
            <Space>
              <Button
                style={{ fontWeight: 700 }}
                className="button-border-hide button-type-round"
                onClick={() => tempSubmit({ description, permission, seriesName })}
                disabled={isFetching}
              >
                임시저장
              </Button>
              <Button
                onClick={detailSetting}
                className="button-type-round button-color-reverse"
                disabled={isFetching}
              >
                세부설정하기
              </Button>
            </Space>
          </Col>
        </Row>
      </Footer>
      <Modal
        className="modal-size-middle"
        key="modal"
        title={<Typography.Title level={3}>임시 포스트 불러오기</Typography.Title>}
        open={open}
        onOk={handleOk}
        closable={false}
        onCancel={handleCancel}
        okText="확인"
        cancelText="취소"
        footer={
          <>
            <div className="left-box" key="left-box" style={{ marginRight: 10 }}>
              <Button key="back" className="button-type-round button-color-red" onClick={handleRemove}>
                삭제
              </Button>
            </div>
            <div className="right-box" key="right-box">
              <Button key="submit" className="button-type-round button-color-white" onClick={handleCancel}>
                취소
              </Button>
              <Button
                key="remove"
                className="button-type-round button-color-normal"
                onClick={handleOk}
              >
                확인
              </Button>
            </div>
          </>
        }
      >
        <Typography.Text>임시저장된 포스트를 불러오시겠습니까?</Typography.Text>
      </Modal>
    </>
  );
}
