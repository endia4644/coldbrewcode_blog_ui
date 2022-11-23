const cors = require("cors");
const bcrypt = require("bcrypt");
const passport = require("passport");
const express = require("express");
const db = require("./models");
const passportConfig = require("./passport");
const session = require("express-session");
const cookie = require("cookie-parser");
const morgan = require("morgan");

const authRouter = require("./routes/auth");
const postRouter = require("./routes/post");
const commentRouter = require("./routes/comment");
const seriesRouter = require("./routes/series");
const hashtagRouter = require("./routes/hashtag");
const imageRouter = require("./routes/image");

const app = express();

const corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
};

db.sequelize.sync();
passportConfig();

app.use(morgan("dev"));
app.use(cors(corsOptions));
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

app.listen(3085, () => {
  console.log(`백엔드 서버 ${3085}번 포트에서 작동중.`);
});
