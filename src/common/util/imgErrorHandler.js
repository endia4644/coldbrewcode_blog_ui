/**
 * @description 이미지 요청 시 오류 핸들링 - 기본 이미지를 전달한다.
 * @param {object} defaultImg // 기본 이미지 컴포넌트 전달
 */
export const createImgErrorHandler = ({ defaultImg }) => {
  return (e) => {
    if (e.target.src === defaultImg) return;
    e.target.src = defaultImg;
  };
};