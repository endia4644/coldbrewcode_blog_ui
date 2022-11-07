// @ts-nocheck
const express = require('express');
const { isLoggedIn } = require('./middleware');
const db = require('../models');
const { Op, literal } = require("sequelize");

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    //* 트랜잭션 설정
    await db.sequelize.transaction(async (t) => {
      const newPost = await db.Post.create({
        postName: req.body.postName,
        postContent: req.body.postContent,
        postIntroduce: req.body.postIntroduce,
        likeCnt: 0,
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
      return res.json(fullPost);
    })
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      include: [{
        model: db.User,
        attributes: ['id', 'email', 'nickName']
      }, {
        model: db.Hashtag,
        required: false,
      }, {
        model: db.Comment,
        as: 'Comments',
        attributes: ['id', 'commentContent', 'createdAt', 'updatedAt', 'dltYsno', [literal('(SELECT COUNT("ParentId") FROM Comments WHERE `Comments.id` = Comments.ParentId)'), 'childCount']],
        required: false,
        where: {
          commentDepth: {
            [Op.eq]: 0, // 게시글에서는 1단계 댓글만 조회한다.
          }
        }
      }],
      order: [
        ['createdAt', 'DESC'],
        [db.Comment, 'createdAt', 'DESC']
      ],
      offset: req.query.offset,
      limit: req.query.limit
    });
    return res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      where: {
        id: req.params.id
      },
      include: [{
        model: db.User,
        attributes: ['id', 'email', 'nickName']
      }, {
        model: db.Hashtag,
        required: false,
      }, {
        model: db.Comment,
        as: 'Comments',
        attributes: ['id', 'commentContent', 'createdAt', 'updatedAt', 'dltYsno', [literal('(SELECT COUNT("ParentId") FROM Comments WHERE `Comments.id` = Comments.ParentId)'), 'childCount']],
        required: false,
        where: {
          commentDepth: {
            [Op.eq]: 0, // 게시글에서는 1단계 댓글만 조회한다.
          }
        }
      }],
      order: [
        ['createdAt', 'DESC'],
        [db.Comment, 'createdAt', 'DESC']
      ],
      offset: req.query.offset,
      limit: req.query.limit
    });
    return res.json(posts);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
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
    res.send('삭제 되었습니다.');
  } catch (err) {
    console.error(err);
    next(err);
  }
})

module.exports = router;