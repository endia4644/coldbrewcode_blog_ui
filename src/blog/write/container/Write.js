import React, { useEffect, useRef, useState } from "react";
import { Content, Footer } from "antd/lib/layout/layout";
import "react-quill/dist/quill.snow.css";
import Editor from "../components/Editor";
import { Button, Col, Divider, Input, Row, Space } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { useNavigate, useParams } from "react-router-dom"; // 설치한 패키지
import "../scss/write.scss";
import { useDispatch, useSelector } from "react-redux";
import { actions } from "../state";
import WriteSetting from "./WriteSetting";
import { AnimatePresence } from "framer-motion";
import useNeedLogin from "../../../common/hook/useNeedLogin";

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
  const [imageArray] = useState([]);
  const post = useSelector(state => state.write.post);

  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!postId) {
      return;
    }
    dispatch(actions.fetchPost(postId));
  }, [postId, dispatch]);

  useEffect(() => {
    if (!post) {
      return;
    }
    setPostName(post?.postName);
    setHashtag(post?.Hashtags ?? []);
    post?.Hashtags.map(item => tagRef.current.add(item?.key));
  }, [post]);
  const getHtmlContent = (htmlContent) => {
    setHtmlContent(htmlContent);
  };

  const goBlog = () => {
    navigate("/blog");
  };

  const detailSetting = () => {
    imageArray.length = 0;
    insertHashTag();

    setLevel(1);
    dispatch(actions.setValue("postName", postName));
    dispatch(actions.setValue("postContent", htmlContent));
    dispatch(actions.setValue("hashtag", Array.from(tagRef.current)));
    htmlContent?.match(/[^='/]*\.(gif|jpg|jpeg|bmp|svg|png)/g)?.map((item) => {
      if (imageMap.current.get(item)) {
        return imageArray.push(imageMap.current.get(item));
      } else {
        return false;
      }
    });
  };

  const insertHashTag = () => {
    if (currentTag !== "" && !tagRef.current.has(currentTag)) {
      setHashtag([...hashtag, { key: currentTag, hashtagName: currentTag }]);
      tagRef.current.add(currentTag);
    }
    setCurrentTag("");
    console.log(tagRef.current);
  };

  return (
    <>
      <AnimatePresence>
        {level > 0 && (
          <WriteSetting
            setLevel={setLevel}
            hashtag={hashtag}
            postContent={htmlContent}
            postName={postName}
            postImages={imageArray}
            postThumnail={post?.postThumnail}
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
          postId={postId}
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
    </>
  );
}
