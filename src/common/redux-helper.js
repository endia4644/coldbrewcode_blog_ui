import produce from "immer";

export function createReducer(initialState, handlerMap) {
  return function (state = initialState, action) {
    const handler = handlerMap[action.type];
    if (handler) {
      if (action[NOT_IMMUTABLE]) {
        return handler(state, action);
      } else {
        /**
         * produce의 첫번째 상대값은 기존값, 두번째 함수는 변경함수이다.
         * 변경하여 새로운 객체를 리턴한다.
         */
        return produce(state, (draft) => {
          const handler = handlerMap[action.type];
          handler(draft, action);
        });
      }
    } else {
      return state;
    }
  };
}

export function createSetValueAction(type) {
  return (keyOrObj, val) => {
    let key, value, fetchKey;
    if (keyOrObj !== null && typeof keyOrObj === 'object') {
      ({ key, value, fetchKey } = keyOrObj);
    } else {
      key = keyOrObj;
      value = val;
    }
    const action = { type, key, value };
    if (fetchKey) {
      action[FETCH_KEY] = fetchKey;
    }
    return action;
  };
}
export function setValueReducer(state, action) {
  const key = action.key; // 'post', 'keyword' 등
  const fetchKey = action[FETCH_KEY]; // Symbol 값으로 꺼낸 키

  if (!fetchKey) {
    // fetchKey가 없는 일반적인 업데이트 처리
    state[key] = action.value;
  } else {
    // fetchKey가 있는 경우: 해당 객체가 없으면 생성 후 할당
    if (!state[key]) state[key] = {};
    state[key][fetchKey] = action.value;
  }
}

export const FETCH_PAGE = Symbol("FETCH_PAGE");
export const FETCH_KEY = Symbol("FETCH_KEY");
export const NOT_IMMUTABLE = Symbol("NOT_IMMUTABLE");
