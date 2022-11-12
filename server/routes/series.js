// @ts-nocheck
const express = require('express');
const { isLoggedIn } = require('./middleware');
const db = require('../models');
const { fn, col, Op } = require("sequelize");
const { makeResponse } = require('../util');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    //* 트랜잭션 설정
    await db.sequelize.transaction(async (t) => {
      const newPost = await db.Post.create({
        postName: req.body.postName,
        postContent: req.body.postContent,
        postDescription: req.body.postDescription,
        likeCnt: 0,
        lockYsno: req.body.lockYsno,
        dltYsno: 'N',
        UserId: req.user.id,
        SeriesId: req.body.seriesId
      }, {
        transaction: t, // 이 쿼리를 트랜잭션 처리
      })
      if (req.body.hashtags) {
        /* 해시태그 테이블 INSERT  */
        const hashtags = await Promise.all(req.body.hashtags.map(tag => db.Hashtag.findOrCreate({
          where: { hashtagName: tag },
          transaction: t, // 이 쿼리를 트랜잭션 처리
        })));
        /* 매핑 테이블 INSERT  */
        await hashtags.map(r => newPost.addHashtags(r[0]))
      }
      const fullPost = await db.Post.findOne({
        where: { id: newPost.id },
        transaction: t, // 이 쿼리를 트랜잭션 처리
        include: [{
          model: db.User,
          attributes: ['id', 'email', 'nickName'],
        }]
      })
      res.send(makeResponse({ data: fullPost }));
    })
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const series = await db.Series.findAll({
      attributes: ['id', 'seriesName', [fn('COUNT', col('Posts.id')), 'postCount'], 'createdAt', 'updatedAt'],
      include: [{
        model: db.Post,
        as: 'Posts',
        required: false,
        attributes: [],
        where: {
          dltYsno: {
            [Op.eq]: 'N'
          }
        },
      }],
      group: ['id'],
    });
    const seriesTotalCount = db.Series.count();
    return res.send(makeResponse({ data: series, totalCount: seriesTotalCount }));
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const Serieses = await db.Series.findOne({
      where: {
        id: req.params.id
      },
      attributes: ['id', 'seriesName', 'createdAt', 'updatedAt'],
      include: [{
        model: db.Post,
        as: 'Posts',
        required: false,
        attributes: ['id', 'postContent', 'postName', 'postDescription', 'likeCnt', 'createdAt', 'updatedAt', 'dltYsno'],
        include: [{
          model: db.User,
          attributes: ['id', 'email', 'nickname']
        }],
        where: {
          dltYsno: {
            [Op.eq]: 'N'
          }
        },
        order: [['id', 'DESC']],
      }],
    });
    return res.json(Serieses);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await db.sequelize.transaction(async (t) => {
      await db.Post.update({ dltYsno: 'Y', seriesId: null }, {
        where: {
          id: req.params.id,
        },
        transaction: t, // 이 쿼리를 트랜잭션 처리
      })
      const deletePost = await db.Post.findOne({
        where: {
          id: req.params.id,
        },
        transaction: t, // 이 쿼리를 트랜잭션 처리
        attributes: ['SeriesId']
      })
      if (deletePost.SeriesId != null) {
        const seriesCount = await db.Post.count({
          where: {
            SeriesId: deletePost.SeriesId,
            dltYsno: 'N'
          },
          transaction: t, // 이 쿼리를 트랜잭션 처리
        })
        if (seriesCount === 0) {
          await db.Series.destroy({
            where: {
              id: deletePost.SeriesId
            },
            transaction: t, // 이 쿼리를 트랜잭션 처리
          })
        }
      }
    })
    res.send(makeResponse({ data: 'SUCCESS' }));
  } catch (err) {
    console.error(err);
    next(err);
  }
})

module.exports = router;