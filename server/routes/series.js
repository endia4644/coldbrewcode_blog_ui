// @ts-nocheck
const express = require('express');
const { isLoggedIn } = require('./middleware');
const db = require('../models');

const router = express.Router();

router.post('/', isLoggedIn, async (req, res, next) => {
  try {
    const newSeries = await db.Series.create({
      seriesName: req.body.seriesName,
    })
    return res.json(newSeries.id);
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get('/', async (req, res, next) => {
  try {
    const Seriess = await db.Series.findAll({
      attributes: ['id', 'seriesName', 'createdAt', 'updatedAt'],
      include: [{
        model: db.Post,
        as: 'Posts',
        required: false,
        attributes: ['id', 'postContent', 'postName', 'postIntroduce', 'likeCnt', 'createdAt', 'updatedAt', 'dltYsno'],
        include: [{
          model: db.User,
          attributes: ['id', 'email', 'nickname']
        }],
        order: [['id', 'DESC']],
      }],
    });
    return res.json(Seriess);
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
        attributes: ['id', 'postContent', 'postName', 'postIntroduce', 'likeCnt', 'createdAt', 'updatedAt', 'dltYsno'],
        include: [{
          model: db.User,
          attributes: ['id', 'email', 'nickname']
        }],
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
    //* 트랜잭션 설정
    await db.sequelize.transaction(async (t) => {
      const seriesId = req.params.id;
      await db.Post.update({ dltYsno: 'Y' }, {
        where: {
          SeriesId: seriesId
        },
        transaction: t, // 이 쿼리를 트랜잭션 처리
      })
      await db.Series.destroy({
        where: {
          id: seriesId
        },
        transaction: t, // 이 쿼리를 트랜잭션 처리
      })
    })
    res.send('삭제 되었습니다.');
  } catch (err) {
    console.error(err);
    next(err);
  }
})

module.exports = router;