import React, { useEffect, useState } from "react";
import Editor from 'ckeditor5-custom-build/build/ckeditor';
import { CKEditor } from '@ckeditor/ckeditor5-react'
import { API_HOST } from "../../../common/constant";
import axios from "axios";
import { callApi } from "../../../common/util/api";


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
    let interval = setInterval(function() {
      if(edit) {
        const data = edit?.getData();
        getTempHtmlContent(data);
      }
    },10000)

    return () => {
      // @ts-ignore
      clearInterval(interval);
    }
  }, [edit])

  return (
    <div>
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
        }}
      />
    </div>
  );
};