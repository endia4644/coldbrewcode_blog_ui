
import axios from 'axios';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import "react-quill/dist/quill.snow.css";
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { API_HOST } from '../../../common/constant';
import { callApi } from '../../../common/util/api';
import { actions } from '../state';


const Editor = ({ placeholder, value, ...rest }) => {
  const dispatch = useDispatch();
  const [htmlContent, setHtmlContent] = useState(null);
  const { id: postId } = useParams();
  const quillRef = useRef(null);

  useEffect(() => {
    if (!postId) {
      return;
    }
    const fetchData = async () => {
      const { data } = await callApi({
        method: 'get',
        url: `/post/${postId}/content`,
      });
      console.log(data?.[0]?.postContent);
      setHtmlContent(data?.[0]?.postContent ?? '');
    };
    fetchData();
  }, [postId, callApi])

  const handleSubmit = async () => {
    if (postId) {
      //기존 게시글 업데이트
      dispatch(actions.fetchUpdatePost(postId, '게시글', '게시글', htmlContent));
      //history.push(`/@${user.name}/post/${postId}`);
    } else {
      //새로운 게시글 생성
      dispatch(actions.fetchCreatePost('게시글', '게시글', htmlContent));
      //history.push(`/@${user.name}/posts?folder=${selectedFolder}`);
    }
  }

  // 이미지 처리를 하는 핸들러
  const imageHandler = () => {
    console.log('에디터에서 이미지 버튼을 클릭하면 이 핸들러가 시작됩니다!');

    // 1. 이미지를 저장할 input type=file DOM을 만든다.
    const input = document.createElement('input');
    // 속성 써주기
    input.setAttribute('type', 'file');
    input.setAttribute('accept', 'image/*');
    input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
    // input이 클릭되면 파일 선택창이 나타난다.

    // input에 변화가 생긴다면 = 이미지를 선택
    input.addEventListener('change', async () => {
      const file = input.files[0];
      // multer에 맞는 형식으로 데이터 만들어준다.
      const formData = new FormData();
      formData.append('img', file); // formData는 키-밸류 구조
      // 백엔드 multer라우터에 이미지를 보낸다.
      try {
        const url = await axios({
          url: '/post/img',
          method: 'post',
          baseURL: API_HOST,
          data: formData,
          withCredentials: true,
        }).then(response => {
          return `${API_HOST}/${response.data}`
        }).catch(err => {
          return null;
        });
        console.log('성공 시, 백엔드가 보내주는 데이터', url);
        const IMG_URL = url;
        // 이 URL을 img 태그의 src에 넣은 요소를 현재 에디터의 커서에 넣어주면 에디터 내에서 이미지가 나타난다
        // src가 base64가 아닌 짧은 URL이기 때문에 데이터베이스에 에디터의 전체 글 내용을 저장할 수있게된다
        // 이미지는 꼭 로컬 백엔드 uploads 폴더가 아닌 다른 곳에 저장해 URL로 사용하면된다.

        // 이미지 태그를 에디터에 써주기 - 여러 방법이 있다.
        const editor = quillRef.current.getEditor(); // 에디터 객체 가져오기
        // 1. 에디터 root의 innerHTML을 수정해주기
        // editor의 root는 에디터 컨텐츠들이 담겨있다. 거기에 img태그를 추가해준다.
        // 이미지를 업로드하면 -> 멀터에서 이미지 경로 URL을 받아와 -> 이미지 요소로 만들어 에디터 안에 넣어준다.
        // editor.root.innerHTML =
        //   editor.root.innerHTML + `<img src=${IMG_URL} /><br/>`; // 현재 있는 내용들 뒤에 써줘야한다.

        // 2. 현재 에디터 커서 위치값을 가져온다
        const range = editor.getSelection();
        // 가져온 위치에 이미지를 삽입한다
        editor.insertEmbed(range.index, 'image', IMG_URL);
      } catch (error) {
        console.log('실패했어요ㅠ');
      }
    });
  };


  // Quill 에디터에서 사용하고싶은 모듈들을 설정한다.
  // useMemo를 사용해 modules를 만들지 않는다면 매 렌더링 마다 modules가 다시 생성된다.
  // 그렇게 되면 addrange() the given range isn't in document 에러가 발생한다.
  // -> 에디터 내에 글이 쓰여지는 위치를 찾지 못하는듯
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          ['image'],
          [{ header: [1, 2, 3, false] }],
          ['bold', 'italic', 'underline', 'strike', 'blockquote'],
        ],
        handlers: {
          // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
          image: imageHandler,
        },
      },
    };
  }, []);
  // 위에서 설정한 모듈들 foramts을 설정한다
  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'image',
  ];

  return (
    <>
      <ReactQuill
        {...rest}
        ref={quillRef}
        value={htmlContent}
        onChange={setHtmlContent}
        theme="snow"
        modules={{
          ...modules,
        }}
        formats={formats}
        placeholder={placeholder}
        preserveWhitespace
      ></ReactQuill>
      <button onClick={handleSubmit}>완료</button>
    </>
  )
}

export default React.memo(Editor);