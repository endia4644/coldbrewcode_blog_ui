// @ts-nocheck
const express = require('express');
const db = require('../models');
const { fn, col, QueryTypes } = require("sequelize");
const { makeResponse } = require('../util');
const { resolveOnChange } = require('antd/lib/input/Input');

const router = express.Router();

router.get('/', async (req, res, next) => {
  try {
    const totalCount = await db.Post.count();
    const hashtagAll = await db.sequelize.query(
      'SELECT 0 as "id", "전체보기" as "hashtagName", :totalCount as "postCount" FROM dual',
      {
        replacements: { totalCount: totalCount },
        type: QueryTypes.SELECT
      }
    );
    const hashtags = await db.Hashtag.findAll({
      attributes: ['id', 'hashtagName', [fn('COUNT', col('Hashtag.id')), 'postCount']],
      include: {
        model: db.Post,
        attributes: [],
        through: {
          attributes: [],
        }
      },
      order: [
        ['createdAt', 'DESC'],
      ],
      group: ['id', 'hashtagName']
    })

    res.send(makeResponse({ data: [...hashtagAll, ...hashtags], totalCount: totalCount }));
  } catch (err) {
    console.error(err);
    next(err);
  }
});


module.exports = router;