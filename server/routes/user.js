const express = require('express');
const db = require('../models');
const { makeResponse } = require('../util');
const { Op } = require("sequelize");
const { isLoggedIn } = require('./middleware');

const router = express.Router();

router.patch('/nickname', isLoggedIn, async (req, res, next) => {
  try {
    //* 트랜잭션 설정
    await db.sequelize.transaction(async (t) => {
      await db.User.update(
        {
          nickName: req?.body?.nickName
        },
        {
          where: {
            id: {
              [Op.eq]: req?.user?.id
            }
          },
          transaction: t // 이 쿼리를 트랜잭션 처리
        }
      );

      const user = await db.User.findOne({
        attributes: { exclude: ['password'] },
        transaction: t // 이 쿼리를 트랜잭션 처리
      })

      res.send(makeResponse({ data: user }));
    })
  } catch (err) {
    return res.json(
      makeResponse({
        resultCode: -1,
        resultMessage: "닉네임 변경 중 오류가 발생했습니다.",
      })
    );
  }
});


module.exports = router;