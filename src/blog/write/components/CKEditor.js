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
  editorBody
}) {

  const [edit, setEdit] = useState(null);
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

  function isEmptyObj(obj)  {
    // 객체 타입체크
    if(obj.constructor !== Object)  {
      return false;
    }
    
    // property 체크
    for(let prop in obj)  {
      if(obj.hasOwnProperty(prop))  {
        return false;
      }
    }
    
    return true;
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
  }, []);

  useEffect(() => {
    let interval = setInterval(function() {
      if(edit) {
        const data = edit?.getData();
        getHtmlContent(data);
      }
    },300000)

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