const cors = require("cors");
const passport = require("passport");
const express = require("express");
const session = require("express-session");
const cookie = require("cookie-parser");
const morgan = require("morgan");
const dotenv = require("dotenv");
const hpp = require("hpp");
const helmet = require("helmet");

const db = require("./models");
const passportConfig = require("./passport");
const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const seriesRouter = require("./routes/series");
const hashtagRouter = require("./routes/hashtag");
const imageRouter = require("./routes/image");
const { makeResponse } = require("./util");

const app = express();
const prod = process.env.NODE_ENV === "production";
dotenv.config();
db.sequelize.sync();
passportConfig();

if (prod) {
  app.use(hpp());
  app.use(helmet());
  app.use(morgan("combined"));
  app.use(
    cors({
      origin: "http://localhost:3000",
      credentials: true,
    })
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}

app.use("/", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie());
app.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "cookiesecret",
    cookie: {
      httpOnly: true,
      secure: false,
      domain: prod && ".nodebird.com",
    },
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/auth", authRouter);
app.use("/post", postRouter);
app.use("/comment", commentRouter);
app.use("/series", seriesRouter);
app.use("/hashtag", hashtagRouter);
app.use("/image", imageRouter);

app.use(function (error, req, res, next) {
  // 에러 헨들링
  res.send(
    makeResponse({
      resultCode: -1,
      resultMessage:
        error !== "null" && error ? error : "서비스 오류가 발생했습니다",
    })
  );
});

app.listen(3085, () => {
  console.log(`백엔드 서버 ${3085}번 포트에서 작동중.`);
});
