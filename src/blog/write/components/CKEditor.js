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
  imageMap,
  ...rest
}) {
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
                console.log(`${API_HOST}/${fileName}`);
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
    };
    fetchData();
  }, [postId]);

  return (
    <div>
      <CKEditor
        editor={Editor}
        config={{
          extraPlugins: [uploadPlugin],
          placeholder: '기록하고 싶은 이야기를 적어보세요.',
        }}
        data={htmlContent}
        onChange={(event, editor) => {
          const data = editor.getData();
          getHtmlContent(data);
        }}
      />
    </div>
  );
};