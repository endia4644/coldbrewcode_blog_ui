import React, { createContext, useCallback, useEffect, useRef, useState } from "react";
import { Content, Footer } from "antd/lib/layout/layout";
import "react-quill/dist/quill.snow.css";
import Editor from "../components/Editor";
import { Button, Col, Divider, Input, message, Modal, Row, Space, Typography } from "antd";
import { ArrowLeftOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom"; // 설치한 패키지
import "../scss/write.scss";
import { useDispatch, useSelector } from "react-redux";
import { actions, INITINAL_STATE, Types } from "../state";
import WriteSetting from "./WriteSetting";
import { AnimatePresence } from "framer-motion";
import useNeedLogin from "../../../common/hook/useNeedLogin";
import useFetchInfo from "../../../common/hook/useFetchInfo";
import { FetchStatus } from "../../../common/constant";
import { actions as common } from "../../../common/state";

export default function Write() {
  useNeedLogin();
  const { id: postId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const tagRef = useRef(new Set());
  const imageMap = useRef(new Map());
  const [currentTag, setCurrentTag] = useState("");
  const [hashtag, setHashtag] = useState([]);
  const [htmlContent, setHtmlContent] = useState(null);
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


  const { fetchStatus: tfetchStatus } = useFetchInfo(Types.FetchCreateTempPost);

  const [level, setLevel] = useState(0);

  const key = "updatable";

  const [open, setOpen] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    dispatch(actions.fetchTempPost({ postId: post?.id, id: post?.TempPostId }));
    dispatch(actions.setValue("postType", "temp"));
    dispatch(actions.setValue("tempId", post?.TempPostId));
    setOpen(false);
  };
  const handleCancel = () => {
    setOpen(false);
  };

  const deleteStatus = useCallback(
    (actionType, fetchKey) => {
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

  useEffect(() => {
    if (!postId) {
      return;
    }
    dispatch(actions.fetchPost(postId));
    return () => {
      dispatch(actions.setValue('post', null));
    }
  }, [postId, dispatch]);

  useEffect(() => {
    if (!post) {
      return;
    }
    if (!post?.TempPostId) {
      return;
    }
    showModal();
  }, [post, dispatch]);

  useEffect(() => {
    if (!post) {
      return;
    }
    setPostName(post?.postName);
    setHashtag(post?.Hashtags ?? []);

    post?.Hashtags?.map(item => tagRef.current.add(item.key));

    /* 임시저장을 위한 필수값 세팅 */
    dispatch(actions.setValue('postName', post?.postName));
    dispatch(actions.setValue('postContent', post?.postContent));
    dispatch(actions.setValue('hashtag', post?.Hashtags));
    dispatch(actions.setValue('postDescription', post?.postDescription));
    dispatch(actions.setValue('postThumbnail', post?.postThumbnail));
    dispatch(actions.setValue('thumbnailId', post?.postThumbnailId));
    dispatch(actions.setValue('permission', post?.permission));
    dispatch(actions.setValue('seriesName', post?.Series?.[0]?.seriesName));
    dispatch(actions.setValue('seriesList', post?.Series));
  }, [post]);

  const getHtmlContent = (htmlContent) => {
    setHtmlContent(htmlContent);
  };

  const goBlog = () => {
    navigate("/blog");
  };

  const detailSetting = () => {
    const images = [];
    insertHashTag();

    setLevel(1);
    dispatch(actions.setValue("postName", postName));
    dispatch(actions.setValue("postContent", htmlContent));
    dispatch(actions.setValue("hashtag", Array.from(tagRef.current)));
    htmlContent?.match(/[^='/]*\.(gif|jpg|jpeg|bmp|svg|png)/g)?.map((item) => {
      if (imageMap.current.get(item)) {
        return images.push(imageMap.current.get(item));
      } else {
        return false;
      }
    });
    if (images?.length > 0) {
      dispatch(actions.setValue('imageList', [...images]))
    }
  };

  const insertHashTag = () => {
    if (currentTag !== "" && !tagRef.current.has(currentTag)) {
      setHashtag([...hashtag, { key: currentTag, hashtagName: currentTag }]);
      tagRef.current.add(currentTag);
    }
    setCurrentTag("");
  };

  const openTempMessage = useCallback(
    (status) => {
      if (status === FetchStatus.Success) {
        message.success({
          content: "임시저장이 완료되었습니다",
          key,
          duration: 2,
        });
        deleteStatus(Types.FetchCreateTempPost);
        setTimeout(() => {
          goBlog();
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
    [goBlog]
  );

  /* 임시저장 */
  function tempSubmit({ description, permission, seriesName }) {
    let imageIds = [];
    let hashtags = [];
    if (imageList?.length > 0) {
      imageIds = [...imageList];
    }
    if (thumbnailId) {
      imageIds.push(thumbnailId);
    }
    if (hashtag) {
      hashtag.map((item) => {
        return hashtags.push(item.key);
      });
    }
    dispatch(
      actions.fetchCreateTempPost({
        postId: postId,
        postName: postName,
        hashtags: hashtags,
        postDescription: description,
        postContent: htmlContent,
        postThumbnail: `${thumbnail ?? null}`,
        permission: permission,
        seriesName: seriesName,
        imageIds: imageIds,
      })
    );
  }

  /* 임시 저장 메시지 */
  useEffect(() => {
    if (!postId || !tempId) {
      if (tfetchStatus === FetchStatus.Request) {
        openTempMessage(tfetchStatus);
      }
      if (tfetchStatus !== FetchStatus.Request) {
        openTempMessage(tfetchStatus);
      }
    }
  }, [tfetchStatus, openTempMessage]);

  /* 언마운트 시 INITINAL_STATE 초기화 */
  useEffect(() => {
    return () => {
      for (const [key, value] of Object.entries(INITINAL_STATE)) {
        dispatch(actions.setValue(key, value));
      }
    }
  }, [])

  return (
    <>
      <AnimatePresence>
        {level > 0 && (
          <WriteSetting
            setLevel={setLevel}
            hashtag={hashtag}
            postContent={htmlContent}
            postName={postName}
            postThumbnail={post?.postThumbnail}
            postThumbnailId={post?.postThumbnailId}
            postDescription={post?.postDescription}
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
              onClick={goBlog}
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
              >
                임시저장
              </Button>
              <Button
                onClick={detailSetting}
                className="button-type-round button-color-reverse"
              >
                세부설정하기
              </Button>
            </Space>
          </Col>
        </Row>
      </Footer>
      <Modal
        className="modal-size-middle"
        title={<><Typography.Title level={3}>임시 포스트 불러오기</Typography.Title></>}
        open={open}
        onOk={handleOk}
        closable={false}
        onCancel={handleCancel}
        okText="확인"
        cancelText="취소"
      >
        <Typography.Text>임시저장된 포스트를 불러오시겠습니까?</Typography.Text>
      </Modal>
    </>
  );
}
