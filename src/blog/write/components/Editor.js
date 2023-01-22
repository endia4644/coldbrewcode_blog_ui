import axios from "axios";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import ReactQuill, { Quill } from "react-quill";
import { API_HOST } from "../../../common/constant";
import { callApi } from "../../../common/util/api";
import ImageResize from "quill-image-resize-module-react";

import "react-quill/dist/quill.snow.css";
import "highlight.js/styles/github.css";

var icons = ReactQuill.Quill.import('ui/icons');

const fontFamilyArr = ["MapleStory", "NotoSans", "Roboto", "Sono", "NanumGothic"];
let fonts = Quill.import("attributors/style/font");
fonts.whitelist = fontFamilyArr;
Quill.register(fonts, true);

const fontSizeArr = ["8px", "10px", "11px", "12px", "14px", "18px", "24px", "36px", "48px"];
var size = Quill.import("attributors/style/size");
size.whitelist = fontSizeArr;
Quill.register(size, true);

const CodeBlock = Quill.import('formats/code-block');
// See - https://github.com/quilljs/quill/blob/develop/modules/clipboard.js#L513
CodeBlock.tagName = 'PRE';

Quill.register({
  'formats/code-block': CodeBlock
});

Quill.register("modules/imageResize", ImageResize);

const BaseImage = Quill.import("formats/image");

const ATTRIBUTES = ["alt", "height", "width", "style"];

let BlockEmbed = Quill.import('blots/block/embed');

class DividerBlot extends BlockEmbed { }
DividerBlot.blotName = 'divider';
DividerBlot.tagName = 'hr';

Quill.register('formats/divider', DividerBlot);
icons['divider'] = `<span role="img" aria-label="minus" class="anticon anticon-minus"><svg viewBox="64 64 896 896" focusable="false" data-icon="minus" width="1em" height="1em" fill="currentColor" aria-hidden="true"><path d="M872 474H152c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h720c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"></path></svg></span>`;

class Image extends BaseImage {
  static formats(domNode) {
    return ATTRIBUTES.reduce(function (formats, attribute) {
      if (domNode.hasAttribute(attribute)) {
        formats[attribute] = domNode.getAttribute(attribute);
      }
      return formats;
    }, {});
  }
}

Quill.register(Image, true);

const code = Quill.import("formats/code");

Quill.register(code, true);

export default function Editor({
  postType,
  postId,
  placeholder,
  htmlContent,
  getHtmlContent,
  imageMap,
  ...rest
}) {
  const quillRef = useRef(null);

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

  const customHrHandler = () => {
    const editor = quillRef.current.getEditor();
    // get the position of the cursor
    var range = editor.getSelection();
    if (range) {
      // insert the <hr> where the cursor is
      editor.insertEmbed(range.index, "divider", "null")
    }
  }

  // 이미지 처리를 하는 핸들러
  const imageHandler = useCallback(() => {
    // 1. 이미지를 저장할 input type=file DOM을 만든다.
    const input = document.createElement("input");
    // 속성 써주기
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click(); // 에디터 이미지버튼을 클릭하면 이 input이 클릭된다.
    // input이 클릭되면 파일 선택창이 나타난다.

    // input에 변화가 생긴다면 = 이미지를 선택
    input.addEventListener("change", async () => {
      const file = input.files[0];
      // multer에 맞는 형식으로 데이터 만들어준다.
      const formData = new FormData();
      formData.append("image", file); // formData는 키-밸류 구조
      // 백엔드 multer라우터에 이미지를 보낸다.
      try {
        const res = await axios({
          url: "/image",
          method: "post",
          baseURL: API_HOST,
          data: formData,
          withCredentials: true,
        })
          .then((response) => {
            return {
              id: response?.data?.id ?? null,
              fileName: response?.data?.fileName ?? null,
            };
          })
          .catch((err) => {
            return null;
          });
        imageMap.current.set(res.fileName, res.id);
        const IMG_URL = `${API_HOST}/${res.fileName}`;
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
        editor.insertEmbed(range.index, "image", IMG_URL);
      } catch (error) {
        console.log(error);
      }
    });
  }, [imageMap]);

  // Quill 에디터에서 사용하고싶은 모듈들을 설정한다.
  // useMemo를 사용해 modules를 만들지 않는다면 매 렌더링 마다 modules가 다시 생성된다.
  // 그렇게 되면 addrange() the given range isn't in document 에러가 발생한다.
  // -> 에디터 내에 글이 쓰여지는 위치를 찾지 못하는듯
  const modules = useMemo(() => {
    return {
      toolbar: {
        container: [
          [
            {
              font: fontFamilyArr,
            },
          ],
          [{ header: [1, 2, 3, 4, 5] }, { size: fontSizeArr }],
          [{ color: [] }, "bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          [{ align: [] }],
          ['blockquote', 'code-block', 'code'],
          ["image"],
          ["divider"],
        ],
        handlers: {
          // 이미지 처리는 우리가 직접 imageHandler라는 함수로 처리할 것이다.
          image: imageHandler,
          divider: customHrHandler,
        },
      },
      imageResize: {
        // https://www.npmjs.com/package/quill-image-resize-module-react 참고
        parchment: Quill.import("parchment"),
        modules: ["Resize", "DisplaySize", "Toolbar"],
      },
    };
  }, [imageHandler]);
  // 위에서 설정한 모듈들 foramts을 설정한다
  const formats = [
    "size",
    "font",
    "bold",
    "header",
    "italic",
    "underline",
    "script",
    "strike",
    "blockquote",
    "code",
    "image",
    "color",
    "align",
    "code-block",
    "width",
    "style",
    "list",
    "divider",
  ];

  return (
    <>
      <ReactQuill
        {...rest}
        ref={quillRef}
        value={htmlContent}
        style={{ height: "calc(100vh - 270px)" }}
        scrollingContainer={"quill"}
        onChange={getHtmlContent}
        theme="snow"
        modules={{
          ...modules,
        }}
        formats={formats}
        placeholder={placeholder}
      ></ReactQuill>
    </>
  );
}