// @ts-nocheck
import React, { useEffect, useState } from "react";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { API_HOST, AUTO_SAVE_TIME } from "../../../common/constant";
import axios from "axios";
import { callApi } from "../../../common/util/api";
import { Helmet } from "react-helmet";


export default function CEitor({
  postType,
  postId,
  placeholder,
  htmlContent,
  getHtmlContent,
  getTempHtmlContent,
  imageMap
}) {

  const [edit, setEdit] = useState(null);

  const [postIdInit, setPostIdInit] = useState(false);

  const [typingYsno, setTypingYsno] = useState(false);

  const [timerMs, setTimerMs] = useState(new Date().getTime());

  const [CurrentMs, setCurrentMs] = useState(new Date().getTime() + AUTO_SAVE_TIME);
  /**
   * 
   * @param {*} loader 
   * @returns
   * @description 커스텀 업로드 어뎁터 -> 이미지를 서버로 업로드한다. 
   */
  function uploadAdapter(loader) {
    return {
      upload: () => {
        return new Promise((resolve, reject) => {
          const formData = new FormData();
          loader.file.then(async (file) => {
            formData.append("image", file);

            await axios({
              url: "/image",
              method: "post",
              baseURL: API_HOST,
              data: formData,
              withCredentials: true,
            })
              .then((response) => {
                const id = response?.data?.id ?? null;
                const fileName = response?.data?.fileName ?? null;
                if (id && fileName) {
                  imageMap.current.set(fileName, id);
                  resolve({
                    default: `${API_HOST}/${fileName}`
                  });
                } else {
                  reject();
                }
              })
              .catch((err) => {
                return null;
              });
          });
        });
      }
    };
  }

  /**
   * 
   * @param {*} editor 
   * @returns
   * @description 커스텀 업로드 플러그인 -> 이미지 처리 어댑터를 등록한다.
   */
  function uploadPlugin(editor) {
    editor.plugins.get('FileRepository').createUploadAdapter = (loader) => {
      return uploadAdapter(loader);
    };
  }

  useEffect(() => {
    if (!postId) {
      return;
    }
    const fetchData = async () => {
      const firstType = postType;
      // 게시글 타입이 임시이고, 처음 호출됬을때와 타입이 변경되지 않은 경우
      if(postType === 'temp' && firstType === postType) {
        if(!postIdInit) {
          setPostIdInit(true);
          const { data } = await callApi({
            method: "get",
            url: `/post/${postId}/content?postType=${postType}`,
          });
          getHtmlContent(data?.postContent ?? "");
          if (data?.images?.length > 0) {
            data?.images?.map((item) => {
              return imageMap.current.set(item.fileName, item.id)
            })
          }
        }
      } else {
      // 게시글 타입이 게시글이거나 처음 호출됬을때와 타입이 변경된 경우 ( 임시글 불러오기 했을 경우, 또는 임시글 수정)  
        const { data } = await callApi({
          method: "get",
          url: `/post/${postId}/content?postType=${postType}`,
        });
        getHtmlContent(data?.postContent ?? "");
        if (data?.images?.length > 0) {
          data?.images?.map((item) => {
            return imageMap.current.set(item.fileName, item.id)
          })
        }
      }
    };
    fetchData();
  }, [postId]);

  useEffect(() => {
    const time = setInterval(() => {
      if(new Date().getTime() - timerMs >= 2000 && !typingYsno) {
        setTypingYsno(true);
      }
    },1000);

    return () => {
      // @ts-ignore
      clearInterval(time);
    }
  }, [typingYsno,timerMs])

  useEffect(() => {

  },[CurrentMs])

  useEffect(() => {
    if(edit) {
      // 이전 저장으로부터 5분이상이 경과했고, 2초 이상 입력이 없을 경우 임시저장을 실행한다.
      // 커서 이동 문제로 입력이 없을경우만 임시저장
      if(typingYsno) {
        if(CurrentMs <= new Date().getTime()){
          setCurrentMs(CurrentMs + AUTO_SAVE_TIME);
          const data = edit?.getData();
          getHtmlContent(data);
          getTempHtmlContent(data);
        }
      }
    }
  }, [edit,typingYsno,CurrentMs,getHtmlContent,getTempHtmlContent])

  return (
    <div>
      <Helmet>
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.css" integrity="sha384-GvrOXuhMATgEsSwCs4smul74iXGOixntILdUW9XmUC6+HX0sLNAK3q71HotJqlAn" crossorigin="anonymous" />
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/katex.min.js" integrity="sha384-cpW21h6RZv/phavutF+AuVYrr+dA8xD9zs6FwLpaCct6O9ctzYFfFr4dgmgccOTx" crossorigin="anonymous"></script>
        <script defer src="https://cdn.jsdelivr.net/npm/katex@0.16.8/dist/contrib/auto-render.min.js" integrity="sha384-+VBxd3r6XgURycqtZ117nYw44OOcIax56Z4dCRWbxyPt0Koah1uHoK0o4+/RRE05" crossorigin="anonymous"
            onload="renderMathInElement(document.body);"></script>
      </Helmet>
      <CKEditor
        editor={Editor}
        config={{
          extraPlugins: [uploadPlugin],
          placeholder: '기록하고 싶은 이야기를 적어보세요.',
        }}
        data={htmlContent}
        onBlur={(_, editor) => {
          const data = editor?.getData();
          getHtmlContent(data);
        }}
        onChange={(_, editor) => {
          if(edit == null && editor?.getData()) {
            setEdit(editor);
          }
          setTimerMs(new Date().getTime());
          setTypingYsno(false);
        }}
      />
    </div>
  );
};