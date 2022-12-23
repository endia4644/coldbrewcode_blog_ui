// @ts-nocheck
const express = require("express");
const { isLoggedIn } = require("./middleware");
const db = require("../models");
const { Op, literal, fn, col } = require("sequelize");
const { makeResponse } = require("../util");

const router = express.Router();

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    //* 트랜잭션 설정
    await db.sequelize.transaction(async (t) => {
      let series = null;
      if (req.body.seriesName) {
        series = await db.Series.findOne({
          attributes: ["id"],
          where: {
            seriesName: {
              [Op.eq]: req.body.seriesName,
            },
          },
          transaction: t, // 이 쿼리를 트랜잭션 처리
        });
      }
      const newPost = await db.Post.create(
        {
          postName: req.body.postName,
          postContent: req.body.postContent,
          postDescription: req.body.postDescription,
          postThumnail: req.body.postThumnail,
          likeCnt: 0,
          permission: req.body.permission,
          dltYsno: "N",
          UserId: req.user.id,
        },
        {
          transaction: t, // 이 쿼리를 트랜잭션 처리
        }
      );
      if (series?.id) {
        const index = await db.SeriesPost.findOne({
          attributes: [
            [fn('MAX', col('index')), 'currentIndex']
          ],
          where: {
            SeriesId: series.id
          },
          transaction: t, // 이 쿼리를 트랜잭션 처리
        })
        await db.SeriesPost.create(
          {
            index: index?.dataValues?.currentIndex ? Number(index?.dataValues?.currentIndex) + 1 : 1,
            PostId: newPost.id,
            SeriesId: series.id
          },
          {
            transaction: t // 이 쿼리를 트랜잭션 처리
          }
        )
      }
      if (req.body.hashtags) {
        /* 해시태그 테이블 INSERT  */
        const hashtags = await Promise.all(
          req.body.hashtags.map((tag) =>
            db.Hashtag.findOrCreate({
              where: { hashtagName: tag },
              transaction: t, // 이 쿼리를 트랜잭션 처리
            })
          )
        );
        /* 매핑 테이블 INSERT  */
        await hashtags.map((r) => newPost.addHashtags(r[0]));
      }
      /* 사용한 이미지의 저장여부를 변경해준다. */
      if (req.body.imageIds.length > 0) {
        await db.Image.update(
          {
            saveYsno: true,
            PostId: newPost?.id ?? null,
          },
          {
            where: {
              id: {
                [Op.in]: req.body.imageIds,
              },
            },
            transaction: t, // 이 쿼리를 트랜잭션 처리
          }
        );
      }
      const fullPost = await db.Post.findOne({
        where: { id: newPost.id },
        transaction: t, // 이 쿼리를 트랜잭션 처리
        include: [
          {
            model: db.User,
            attributes: ["id", "email", "nickName"],
          },
        ],
      });
      setTimeout(() => {
        return res.send(makeResponse({ data: fullPost }));
      }, 2000);
    });
  } catch (err) {
    console.error(err);
    return res.json(
      makeResponse({
        resultCode: -1,
        resultMessage: "게시글 작성 중 오류가 발생했습니다.",
      })
    );
  }
});

router.patch("/", async (req, res, next) => {
  try {
    //* 트랜잭션 설정
    await db.sequelize.transaction(async (t) => {
      const newPost = await db.Post.update(
        {
          postName: req.body.postName,
          postContent: req.body.postContent,
          postDescription: req.body.postDescription,
          permission: req.body.permission,
          SeriesId: req.body.seriesId,
        },
        {
          where: {
            id: req.body.postId,
          },
          transaction: t, // 이 쿼리를 트랜잭션 처리
        }
      );
      if (req.body.hashtags) {
        /* 해시태그 테이블 INSERT  */
        const hashtags = await Promise.all(
          req.body.hashtags.map((tag) =>
            db.Hashtag.findOrCreate({
              where: { hashtagName: tag },
              transaction: t, // 이 쿼리를 트랜잭션 처리
            })
          )
        );
        /* 매핑 테이블 INSERT  */
        await hashtags.map((r) => newPost.addHashtags(r[0]));
      }
      const fullPost = await db.Post.findOne({
        where: { id: req.body.postId },
        transaction: t, // 이 쿼리를 트랜잭션 처리
        include: [
          {
            model: db.User,
            attributes: ["id", "email", "nickName"],
          },
        ],
      });
      res.send(makeResponse({ data: fullPost }));
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

router.get("/", async (req, res, next) => {
  try {
    let hashtag = req.query.hashtag;
    const postId = {};
    const search = req.query.search;
    const postName = {};
    const postIdList = [];
    /* 태그 조회인 경우 */
    if (hashtag) {
      hashtag = await db.Hashtag.findAll({
        attributes: ["id"],
        where: {
          id: req.query.hashtag,
        },
        include: {
          model: db.Post,
          through: { attributes: [] },
        },
      });
      /* 해시태그 관계 테이블에서 조회한 postId 리스트에 주입 */
      hashtag?.[0]?.Posts.map((post) => postIdList.push(post.id));
      postId[Op.in] = postIdList;
    } else {
      postId[Op.not] = null;
    }
    /* 검색 조회인 경우 */
    if (search) {
      postName[Op.like] = `%${search}%`;
    } else {
      postName[Op.not] = null;
    }
    const posts = await db.Post.findAll({
      where: {
        postName: postName,
        id: postId,
      },
      attributes: [
        'id',
        'postContent',
        'postName',
        'postDescription',
        'postThumnail',
        'permission',
        'dltYsno',
        'createdAt',
        'updatedAt',
        [
          literal(
            '(SELECT COUNT(1) FROM Comments WHERE Comments.PostId = Post.id AND Comments.dltYsno = "N")'
          ),
          "commentCount",
        ],
        [
          literal(
            `(SELECT COUNT(1) FROM postlikeuser WHERE UserId = ${req?.user?.id ?? 0} AND PostId = Post.id)`
          ),
          "likeYsno",
        ],
        [
          literal(
            `(SELECT COUNT(1) FROM postlikeuser WHERE PostId = Post.id)`
          ),
          "likeCount",
        ],
      ],
      include: [
        {
          model: db.User,
          attributes: ["id", "email", "nickName"],
        },
        {
          model: db.Hashtag,
          required: false,
          attributes: ["id", "hashtagName"],
          through: { attributes: [] },
        },
      ],
      order: [
        ["createdAt", "DESC"],
      ],
      offset: parseInt(req.query.offset) || 0,
      limit: parseInt(req.query.limit, 10) || 8,
    });
    const postCnt = await db.Post.count({
      where: {
        postName: postName,
        id: postId,
      },
    });
    return res.send(makeResponse({ data: posts, totalCount: postCnt }));
  } catch (err) {
    console.error(err);
    return res.json(
      makeResponse({
        resultCode: -1,
        resultMessage: "게시글 조회 중 오류가 발생했습니다",
      })
    );
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const postType = req?.query?.postType ?? 'post';
    const post = await db.Post.findOne({
      where: {
        id: req.params.id,
      },
      include: [
        {
          model: db.User,
          attributes: ["id", "email", "nickName"],
        },
        {
          model: db.Hashtag,
          required: false,
        },
      ],
      order: [
        ["createdAt", "DESC"],
      ],
    });
    if (post) {
      const likes = await post.getUsers();
      const likeCurrentUser = req?.user?.id
        ? await post.hasUser(req.user)
        : false;
      const commentCount = await db.Comment.count({
        where: {
          PostId: {
            [Op.eq]: req.params.id
          },
          dltYsno: {
            [Op.eq]: 'N'
          }
        }
      })
      const series = await db.SeriesPost.findOne({
        attributes: ['SeriesId', 'index'],
        where: {
          PostId: {
            [Op.eq]: req.params.id
          }
        }
      })
      let next = null;
      let prev = null;
      let nextOp = {};
      let prevOp = {};
      /* 시리즈 인 경우 처리 케이스 */
      if (postType === 'series') {
        const nextPost = await db.SeriesPost.findOne({
          attributes: ['PostId'],
          where: {
            SeriesId: {
              [Op.eq]: series.SeriesId
            },
            index: {
              [Op.gt]: series.index
            }
          },
          order: [["index", "ASC"]]
        });
        nextOp[Op.eq] = nextPost?.PostId;
        const prevPost = await db.SeriesPost.findOne({
          attributes: ['PostId'],
          where: {
            SeriesId: {
              [Op.eq]: series.SeriesId
            },
            index: {
              [Op.lt]: series.index
            }
          },
          order: [["index", "DESC"]]
        });
        prevOp[Op.eq] = prevPost?.PostId;
      } else {
        nextOp[Op.gt] = req.params.id;
        prevOp[Op.lt] = req.params.id;
      }
      next = await db.Post.findOne(
        {
          attributes: ["id", "postName"],
          where: {
            id: nextOp,
          },
        }
      )
      prev = await db.Post.findOne(
        {
          attributes: ["id", "postName"],
          where: {
            id: prevOp,
          },
        }
      )
      post.set("next", next);
      post.set("prev", prev);
      post.set("likeCount", likes.length);
      post.set("likeYsno", likeCurrentUser);
      post.set("commentCount", commentCount);
    }
    return res.send(makeResponse({ data: post }));
  } catch (err) {
    console.error(err);
    next("게시글 조회 중 오류가 발생했습니다");
  }
});

router.post("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    const user = await db.User.findOne({
      where: {
        id: req.user.id,
      },
    });
    await post.addUser(user);
    return res.send(makeResponse({ data: post }));
  } catch (err) {
    console.error(err);
    next("게시글 찜 등록 중 오류가 발생했습니다");
  }
});

router.delete("/:id/like", isLoggedIn, async (req, res, next) => {
  try {
    const post = await db.Post.findOne({
      where: {
        id: req.params.id,
      },
    });
    const user = await db.User.findOne({
      where: {
        id: req.user.id,
      },
    });
    await post.removeUser(user);
    return res.send(makeResponse({ data: post }));
  } catch (err) {
    console.error(err);
    next("게시글 찜 삭제 중 오류가 발생했습니다");
  }
});

router.get("/:id/content", async (req, res, next) => {
  try {
    const posts = await db.Post.findAll({
      where: {
        id: req.params.id,
      },
      attributes: ["postContent"],
    });
    return res.send(makeResponse({ data: posts }));
  } catch (err) {
    console.error(err);
    return res.json(
      makeResponse({
        resultCode: -1,
        resultMessage: "게시글 내용 조회 중 오류가 발생했습니다.",
      })
    );
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    await db.sequelize.transaction(async (t) => {
      await db.Post.update(
        { dltYsno: "Y", seriesId: null },
        {
          where: {
            id: req.params.id,
          },
          transaction: t, // 이 쿼리를 트랜잭션 처리
        }
      );
      const deletePost = await db.Post.findOne({
        where: {
          id: req.params.id,
        },
        transaction: t, // 이 쿼리를 트랜잭션 처리
        attributes: ["SeriesId"],
      });
      if (deletePost.SeriesId != null) {
        const seriesCount = await db.Post.count({
          where: {
            SeriesId: deletePost.SeriesId,
            dltYsno: "N",
          },
          transaction: t, // 이 쿼리를 트랜잭션 처리
        });
        if (seriesCount === 0) {
          await db.Series.destroy({
            where: {
              id: deletePost.SeriesId,
            },
            transaction: t, // 이 쿼리를 트랜잭션 처리
          });
        }
      }
    });
    return res.send(makeResponse({ data: "SUCCESS" }));
  } catch (err) {
    console.error(err);
    return res.json(
      makeResponse({
        resultCode: -1,
        resultMessage: "게시글 삭제 중 오류가 발생했습니다.",
      })
    );
  }
});

module.exports = router;
