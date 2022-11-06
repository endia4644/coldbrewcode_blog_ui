// @ts-nocheck
const express = require('express');
const { isLoggedIn } = require('./middleware');
const db = require('../models');
const { Op } = require("sequelize");

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const newPost = await db.Post.create({
      postName: req.body.postName,
      postContent: req.body.postContent,
      postIntroduce: req.body.postIntroduce,
      likeCnt: 0,
      dltYsno: 'N',
      UserId: req.user.id,
    })
    if (req.hashtags) {
      const result = await Promise.all(hashtags.map(tag => db.Hashtag.fineOneCreate({
        where: { hashtagName: tag.slice(1).toLowerCase() },
      })));
      await newPost.addHashtags(result.map(r => r[0]));
    }
    const fullPost = await db.Post.findOne({
      where: { id: newPost.id },
      include: [{
        model: db.User,
        attributes: ['id', 'email', 'nickName'],
      }]
    })
    return res.json(fullPost);
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
        model: db.Comment,
        where: {
          commentDepth: {
            [Op.eq]: 0,
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
    await db.Post.update({ dltYsno: 'Y' }, {
      where: {
        id: req.params.id
      }
    })
    res.send('삭제 되었습니다.');
  } catch (err) {
    console.error(err);
    next(err);
  }
})

module.exports = router;