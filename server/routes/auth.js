// @ts-nocheck
const express = require("express");
const passport = require("passport");
const db = require("../models");
const bcrypt = require("bcrypt");
const { isLoggedIn, isNotLoggedIn } = require("./middleware");
const router = express.Router();
const { makeResponse } = require("../util");
const nodemailer = require("nodemailer");

router.post("/", isNotLoggedIn, async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 12);
    const exUser = await db.User.findOne({
      where: {
        email: req.body.email,
      },
    });
    if (exUser) {
      // 이미 회원가입 되어있으면
      return res.status(403).json({
        errorCode: 403,
        message: "이미 회원가입되어있습니다.",
      });
    }
    const newUser = await db.User.create({
      email: req.body.email,
      password: hash,
      userType: req.body.userType,
      nickName: req.body.nickName,
      profileImg: "",
      commentNoticeYsno: req.body.commentNoticeYsno,
      newPostNoticeYsno: req.body.newPostNoticeYsno,
      dltYsno: "N",
    });
    return res.status(200).json(newUser);
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.post("/email", isNotLoggedIn, async (req, res, next) => {
  try {
    if (!req?.body?.email) {
      return res.json(makeResponse({ resultCode: -1, resultMessage: '필수값이 누락되었습니다.' }))
    }

    const id = randomString();
    // 본인 Gmail 계정
    const EMAIL = "endia9858@gmail.com";
    const EMAIL_PW = "onoybeebixsrlhym";

    const newPost = db.Email.create({
      id: randomString(),
      address: req.body.email
    })

    // 이메일 수신자
    let receiverEmail = req.body.email;

    // transport 생성
    let transport = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: EMAIL,
        pass: EMAIL_PW,
      },
    });

    const href = `http://localhost:3000/blog/register?code=${id}`;

    // 전송할 email 내용 작성
    let mailOptions = {
      from: EMAIL,
      to: receiverEmail,
      subject: "ColdBrewCode 회원가입",
      html: `
          <div>
            <div style="max-width: 100%; width: 400px; margin: 0 auto; padding: 1rem; text-align: justify; background: #f8f9fa; border: 1px solid #dee2e6; box-sizing: border-box; border-radius: 4px; color: #868e96; margin-top: 0.5rem; box-sizing: border-box;" id="ext-gen1043"><b style="black">안녕하세요!</b> 회원가입을 계속하시려면 하단의 링크를 클릭하세요. 만약에 실수로 요청하셨거나, 본인이 요청하지 않았다면, 이 메일을 무시하세요.</div>
            <a href="${href}" style="width: 400px; text-decoration: none; text-align:center; display:block; margin: 0 auto; margin-top: 1rem; background: #845ef7; padding-top: 1rem; color: white; font-size: 1.25rem; padding-bottom: 1rem; font-weight: 600; border-radius: 4px;" target="_blank">계속하기</a>
            <div style="text-align: center; margin-top: 1rem; color: #868e96; font-size: 0.85rem;">
            <div>위 버튼을 클릭하시거나, 다음 링크를 열으세요:<br>
              <a style="color: #b197fc;" href="${href}" target="_blank">${href}</a></div>
              <br>
              <div>이 링크는 24시간동안 유효합니다.</div>
            </div>
          </div>
        `,
    };

    // email 전송
    transport.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return;
      }

      console.log(info);
      console.log("send mail success!");
    });
    return res.send(makeResponse({ data: 'OK' }));
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.patch("/", isLoggedIn, async (req, res, next) => {
  const param = {};
  if (req.query.commentNoticeYsno) {
    param["commentNoticeYsno"] = req.query.commentNoticeYsno;
  }
  if (req.query.newPostNoticeYsno) {
    param["newPostNoticeYsno"] = req.query.newPostNoticeYsno;
  }
  try {
    await db.User.update(param, {
      where: {
        id: req.user.id,
        dltYsno: "N",
      },
    });
    return res.send("수정되었습니다.");
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.delete("/", isLoggedIn, async (req, res, next) => {
  try {
    await db.User.update(
      {
        dltYsno: "Y",
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    return res.send("삭제되었습니다.");
  } catch (err) {
    console.log(err);
    return next(err);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      console.error(err);
      return next(err);
    }
    if (info) {
      return res.json(makeResponse({ resultCode: -1, resultMessage: info.message }))
    }
    return req.login(user, async (err) => {
      //세선에다 사용자 정보 저장
      if (err) {
        console.error(err);
        return next(err);
      }
      return res.send(
        makeResponse({
          data: {
            id: user.id,
            email: user.email,
            nickname: user.nickname,
            userType: user.userType,
            profileImg: user.profileImg,
            commentNoticeYsno: user.commentNoticeYsno,
            newPostNoticeYsno: user.newPostNoticeYsno,
          },
        })
      );
    });
  })(req, res, next);
});

router.get("/logout", isLoggedIn, (req, res) => {
  if (req.isAuthenticated()) {
    req.logout((done) => {
      if (done) {
        return res.status(500).send("로그아웃이 실패하였습니다.");
      } else {
        req.session.destroy(null); // 선택사항
        return res.send(
          makeResponse({ resultMessage: "로그아웃 되었습니다." })
        );
      }
    });
  }
});

router.get("/user", async (req, res, next) => {
  try {
    const user = await db.User.findOne({
      where: { id: req?.user?.id ?? null },
      attributes: [
        "id",
        "email",
        "nickname",
        "userType",
        "profileImg",
        "commentNoticeYsno",
        "newPostNoticeYsno",
      ],
    });
    return res.json(makeResponse({ data: user ?? "NOTFIND" }));
  } catch (err) {
    console.error(err);
    return res.status(500).send(makeResponse({ resultCode: 999 }));
  }
});

router.post("/profile", isLoggedIn, async (req, res) => {
  try {
    await db.User.update(
      {
        profileImg: req.body.filename,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );
  } catch (err) {
    console.error(err);
    return res.status(500).send(makeResponse({ resultCode: 999 }));
  }
  res.json(req.body.filename);
});

function randomString() {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz'
  const stringLength = 12
  let randomstring = ''
  for (let i = 0; i < stringLength; i++) {
    const rnum = Math.floor(Math.random() * chars.length)
    randomstring += chars.substring(rnum, rnum + 1)
  }
  return randomstring
}

module.exports = router;
