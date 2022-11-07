const cors = require('cors');
const bcrypt = require('bcrypt');
const passport = require('passport');
const express = require('express');
const db = require('./models');
const passportConfig = require('./passport');
const session = require('express-session');
const cookie = require('cookie-parser');
const morgan = require('morgan');

const userRouter = require('./routes/user');
const postRouter = require('./routes/post');
const commentRouter = require('./routes/comment');
const seriesRouter = require('./routes/series');

const app = express();

const corsOptions = {
  origin: '*',
  credentials: true
}

db.sequelize.sync();
passportConfig();

app.use(morgan('dev'))
app.use(cors(corsOptions));
app.use('/', express.static('uploads'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookie());
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'cookiesecret',
  cookie: {
    httpOnly: true,
    secure: false,
  }
}));
app.use(passport.initialize());
app.use(passport.session());

app.get('/', (req, res) => {
  res.send('안녕 제로초!');
})

app.use('/user', userRouter);
app.use('/post', postRouter);
app.use('/comment', commentRouter);
app.use('/series', seriesRouter);



app.listen(3085, () => {
  console.log(`백엔드 서버 ${3085}번 포트에서 작동중.`)
})