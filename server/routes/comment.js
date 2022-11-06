// @ts-nocheck
const express = require('express');
const { isLoggedIn } = require('./middleware');
const db = require('../models');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const newComment = await db.Comment.create({
      commentContent: req.body.commentContent,
      commentDepth: req.body.commentDepth,
      UserId: req.user.id,
      PostId: req.body.postId,
      ParentId: req.body.parentId
    })
    const fullComment = await db.Comment.findOne({
      where: { id: newComment.id },
      include: [{
        model: db.User,
        attributes: ['id', 'email', 'nickname'],
      }]
    })
    return res.json(fullComment);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const comments = await db.Comment.findOne({
      where: {
        id: req.params.id
      },
      include: [{
        model: db.User,
        attributes: ['id', 'email', 'nickname']
      }, {
        model: db.Comment,
        where: {
          commentDepth: {
            [Op.gt]: req.body.depth,
            [Op.lt]: req.body.depth + 1
          }
        }
      }],
      order: [['createAt', 'DESC']],
    });
    return res.json(comments);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    await db.Comment.update({ dltYsno: 'Y' }, {
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