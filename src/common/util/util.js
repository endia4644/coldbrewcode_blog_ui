export function elapsedTime(date) {
  const start = new Date(date);
  const end = new Date(); // 현재 날짜

  const diff = end.getTime() - start.getTime(); // 경과 시간

  const times = [
    { time: "분", milliSeconds: 1000 * 60 },
    { time: "시간", milliSeconds: 1000 * 60 * 60 },
    { time: "일", milliSeconds: 1000 * 60 * 60 * 24 },
    { time: "개월", milliSeconds: 1000 * 60 * 60 * 24 * 30 },
    { time: "년", milliSeconds: 1000 * 60 * 60 * 24 * 365 },
  ].reverse();

  // 년 단위부터 알맞는 단위 찾기
  for (const value of times) {
    const betweenTime = Math.floor(diff / value.milliSeconds);

    // 큰 단위는 0보다 작은 소수 단위 나옴
    if (betweenTime > 0) {
      return `${betweenTime}${value.time} 전`;
    }
  }

  // 모든 단위가 맞지 않을 시
  return "방금 전";
}

export const isEmpty = (value) => {
  // 1. null이나 undefined인 경우
  if (value === null || value === undefined) return true;

  // 2. 문자열이나 배열인 경우 (length 확인)
  if (typeof value === 'string' || Array.isArray(value)) {
    return value.length === 0;
  }

  // 3. 객체(Object)인 경우 (키의 개수 확인)
  if (typeof value === 'object') {
    return Object.keys(value).length === 0;
  }

  // 4. 숫자나 불리언 등 그 외의 경우는 비어있지 않은 것으로 간주
  return false;
};

/**
 * URL과 파라미터 객체를 결합하여 완성된 URL을 반환합니다.
 * @param {string} url - 기본 주소 (예: '/posts' 또는 '/posts?type=notice')
 * @param {Object} params - 쿼리 파라미터 객체
 * @returns {string} - 파라미터가 결합된 최종 URL
 */
export const makeUrlWithParams = (url, params) => {
  if (!params || Object.keys(params).length === 0) return url;

  // 1. 유효한 값만 필터링 (null, undefined, 빈 문자열 제외)
  const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});

  if (Object.keys(filteredParams).length === 0) return url;

  // 2. URLSearchParams를 이용해 쿼리 문자열 생성
  const queryString = new URLSearchParams(filteredParams).toString();

  // 3. 기존 URL에 ?가 포함되어 있는지 확인하여 연결자(? 또는 &) 결정
  const separator = url.includes("?") ? "&" : "?";

  return `${url}${separator}${queryString}`;
};