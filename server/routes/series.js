// @ts-nocheck
const express = require('express');
const { isLoggedIn } = require('./middleware');
const db = require('../models');
const { fn, col, Op, literal } = require("sequelize");
const { makeResponse } = require('../util');

const router = express.Router();

router.post('/', async (req, res, next) => {
  try {
    //* 트랜잭션 설정
    await db.sequelize.transaction(async (t) => {
      await db.Series.create({
        seriesName: req.body.seriesName,
      }, {
        transaction: t, // 이 쿼리를 트랜잭션 처리
      })
      const series = await db.Series.findAll({
        attributes: ['seriesName'],
        order: [['createdAt', 'DESC']],
        transaction: t, // 이 쿼리를 트랜잭션 처리
      });
      const seriesTotalCount = await db.Series.count({
        transaction: t, // 이 쿼리를 트랜잭션 처리
      });
      return res.send(makeResponse({ data: series, totalCount: seriesTotalCount }));
    })
  } catch (err) {
    console.error(err);
    next('시리즈 작성 중 오류가 발생했습니다.')
  }
});

router.get('/', async (req, res, next) => {
  try {
    const series = await db.Series.findAll({
      attributes: ['id', 'seriesName', [fn('COUNT', col('Posts.id')), 'postCount'], 'createdAt', 'updatedAt'],
      include: [{
        model: db.Post,
        required: false,
        attributes: [],
        where: {
          dltYsno: {
            [Op.eq]: 'N'
          }
        }
      }],
      group: ['id'],
    });
    const seriesTotalCount = await db.Series.count();
    return res.send(makeResponse({ data: series, totalCount: seriesTotalCount }));
  } catch (err) {
    console.error(err);
    next('시리즈 게시글 조회 중 오류가 발생했습니다.')
  }
});

router.get('/name', async (req, res, next) => {
  try {
    const series = await db.Series.findAll({
      attributes: ['id', 'seriesName'],
      order: [['createdAt', 'DESC']],
    });
    const seriesTotalCount = await db.Series.count();
    return res.send(makeResponse({ data: series, totalCount: seriesTotalCount }));
  } catch (err) {
    console.error(err);
    next('시리즈 조회 중 오류가 발생했습니다.')
  }
});


router.get('/:id', async (req, res, next) => {
  try {
    const Serieses = await db.Series.findOne({
      where: {
        id: req.params.id
      },
      attributes: [
        'id',
        'seriesName',
        'createdAt',
        'updatedAt',
      ],
      include: [{
        model: db.Post,
        required: false,
        attributes: [
          'id',
          'postContent',
          'postName',
          'postDescription',
          'postThumbnail',
          'permission',
          'dltYsno',
          'createdAt',
          'updatedAt',
          [
            literal(
              '(SELECT COUNT(1) FROM Comments WHERE Comments.PostId = Posts.id AND Comments.dltYsno = "N")'
            ),
            "commentCount",
          ],
          [
            literal(
              `(SELECT COUNT(1) FROM postlikeuser WHERE UserId = ${req?.user?.id ?? 0} AND PostId = Posts.id)`
            ),
            "likeYsno",
          ],
          [
            literal(
              `(SELECT COUNT(1) FROM postlikeuser WHERE PostId = Posts.id)`
            ),
            "likeCount",
          ],
        ],
        where: {
          dltYsno: {
            [Op.eq]: 'N'
          },
        },
      }],
      order: [[literal('`Posts->SeriesPost`.`idx`'), 'ASC']],
    });
    const totalCount = await db.Series.count({
      where: {
        id: req.params.id
      },
      include: [{
        model: db.Post,
        where: {
          dltYsno: {
            [Op.eq]: 'N'
          },
        }
      }],
    })
    return res.json(makeResponse({ data: Serieses, totalCount: totalCount }));
  } catch (err) {
    console.error(err);
    next('시리즈 상세 조회 중 오류가 발생했습니다.')
  }
});

/**
 * 시리즈 정렬 순서 변경 API
 */
router.patch("/:id/order", async (req, res, next) => {
  try {
    //* 트랜잭션 설정
    await db.sequelize.transaction(async (t) => {
      await db.SeriesPost.destroy(
        {
          where: {
            SeriesId: req.params.id,
          },
          transaction: t, // 이 쿼리를 트랜잭션 처리
        }
      );
      for (const [idx, value] of req.body.posts.entries()) {
        await db.SeriesPost.create(
          {
            idx: idx + 1,
            PostId: value.id,
            SeriesId: req.params.id
          },
          {
            transaction: t, // 이 쿼리를 트랜잭션 처리
          }
        );
      }
      const Serieses = await db.Series.findOne({
        where: {
          id: req.params.id
        },
        transaction: t, // 이 쿼리를 트랜잭션 처리
        attributes: ['id', 'seriesName', 'createdAt', 'updatedAt'],
        include: [{
          model: db.Post,
          where: {
            dltYsno: {
              [Op.eq]: 'N'
            },
          },
        }],
        order: [[literal('`Posts->SeriesPost`.`idx`'), 'ASC']],
      });
      const totalCount = await db.Series.count({
        where: {
          id: req.params.id
        },
        transaction: t, // 이 쿼리를 트랜잭션 처리
        include: [{
          model: db.Post,
          where: {
            dltYsno: {
              [Op.eq]: 'N'
            },
          }
        }],
      })
      res.send(makeResponse({ data: Serieses, totalCount }));
    });
  } catch (err) {
    console.error(err);
    res.json(
      makeResponse({
        resultCode: -1,
        resultMessage: "게시글 수정 중 오류가 발생했습니다.",
      })
    );
  }
});


router.delete('/:id', async (req, res, next) => {
  try {
    await db.sequelize.transaction(async (t) => {
      await db.SeriesPost.destroy(
        {
          where: {
            SeriesId: req.params.id,
          },
          transaction: t, // 이 쿼리를 트랜잭션 처리
        })
      await db.Series.destroy(
        {
          where: {
            id: req.params.id,
          },
          transaction: t, // 이 쿼리를 트랜잭션 처리
        })
    })
    return res.send(makeResponse({ data: 'SUCCESS' }));
  } catch (err) {
    console.error(err);
    next('시리즈 삭제 중 오류가 발생했습니다.')
  }
})

module.exports = router;