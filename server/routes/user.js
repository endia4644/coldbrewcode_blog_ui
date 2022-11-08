// @ts-nocheck
const express = require('express');
const passport = require('passport');
const db = require('../models');
const bcrypt = require('bcrypt');
const { isLoggedIn, isNotLoggedIn, isProfileImgExist } = require('./middleware');
const multer = require('multer');
const router = express.Router();
const path = require('path');

const upload = multer({
  storage: multer.diskStorage({
    destination(req, file, done) {
      done(null, 'uploads');
    },
    filename(req, file, done) {
      const ext = path.extname(file.originalname);
      const basename = path.basename(file.originalname, ext); // coldbrew.png, basename = coldbrew, ext = .png
      done(null, basename + Date.now() + ext);
    }
  }),
  limits: { fileSize: 20 * 1024 * 1024 },
});

router.post('/', isNotLoggedIn, async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    const exUser = await db.User.findOne({
      where: {
        email: req.body.email
      }
    });
    if (exUser) { // 이미 회원가입 되어있으면
      return res.status(403).json({
        errorCode: 403,
        message: '이미 회원가입되어있습니다.'
      });
    }
    const newUser = await db.User.create({
      email: req.body.email,
      password: hash,
      userType: req.body.userType,
      nickName: req.body.nickName,
      profileImg: '',
      commentNoticeYsno: req.body.commentNoticeYsno,
      newPostNoticeYsno: req.body.newPostNoticeYsno,
      dltYsno: 'N'
    })
    return res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.patch('/', isLoggedIn, async (req, res, next) => {
  const param = {};
  if (req.query.commentNoticeYsno) {
    param['commentNoticeYsno'] = req.query.commentNoticeYsno;
  }
  if (req.query.newPostNoticeYsno) {
    param['newPostNoticeYsno'] = req.query.newPostNoticeYsno;
  }
  try {
    await db.User.update(param, {
      where: {
        id: req.user.id,
        dltYsno: 'N'
      }
    })
    return res.send('수정되었습니다.');
  } catch (err) {
    console.log(err);
    return next(err);
  }
})

router.delete('/', isLoggedIn, async (req, res, next) => {
  try {
    await db.User.update({
      dltYsno: "Y"
    }, {
      where: {
        id: req.user.id
      }
    })
    return res.send('삭제되었습니다.')
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.post('/login', isNotLoggedIn, (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.status(401).send(info.message);
    }
    return req.login(user, async (err) => {
      //세선에다 사용자 정보 저장
      if (err) {
        console.error(err);
        return next(err);
      }
      return res.json(user);
    });
  })(req, res, next);
})

router.post('/logout', isLoggedIn, (req, res) => {
  if (req.isAuthenticated()) {
    req.logout((done) => {
      if (done) {
        return res.status(500).send('로그아웃이 실패하였습니다.');
      } else {
        req.session.destroy(null); // 선택사항
        return res.status(200).send('로그아웃 되었습니다.');
      }
    });
  }
})

router.post('/profile', isLoggedIn, isProfileImgExist, upload.single('profileImg'), async (req, res) => {
  try {
    await db.User.update({
      profileImg: req.file.filename
    }, {
      where: {
        id: req.user.id
      }
    })
  } catch (err) {
    console.error(err);
  }
  res.json(req.file.filename);
});

module.exports = router;