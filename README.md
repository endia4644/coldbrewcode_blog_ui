# ColdBrewCode 블로그 개발 프로젝트

# INIT

1. git pull을 받은 뒤,

### `npm init`

2. server 디렉토리로 이동 후,

### `npm init`

# RUN

1. 서버와 클라이언트 모두 런해야 한다.

- client

### `npm start`

- server

### `npm dev`

# Error

1. useSelector 부분에서 오류 발생 시
   useSelector.d.ts 파일의 TState = unknown 부분을 any로 변경해준다.
