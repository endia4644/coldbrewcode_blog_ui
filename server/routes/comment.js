// @ts-nocheck
const express = require("express");
const { isLoggedIn } = require("./middleware");
const db = require("../models");
const sequelize = require("sequelize");
const { makeResponse } = require("../util");
const router = express.Router();

router.post("/", isLoggedIn, async (req, res, next) => {
  try {
    const newComment = await db.Comment.create({
      commentContent: req.body.commentContent,
      commentDepth: req.body.commentDepth,
      dltYsno: "N",
      UserId: req.user.id,
      PostId: req.body.postId,
      ParentId: req.body.parentId,
    });
    const fullComment = await db.Comment.findOne({
      where: { id: newComment.id },
      include: [
        {
          model: db.User,
          attributes: ["id", "email", "nickname"],
        },
      ],
    });
    return res.send(makeResponse(fullComment));
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const comments = await db.Comment.findOne({
      where: {
        id: req.params.id,
      },
      attributes: ["id", "commentContent", "createdAt", "updatedAt", "dltYsno"],
      include: [
        {
          model: db.User,
          attributes: ["id", "email", "nickname"],
        },
        {
          /* 대댓글을 조회한다. */
          model: db.Comment,
          as: "childComment",
          required: false,
          /* 
          서브쿼리로 조회된 댓글의 대댓글 갯수를 조회한다. 
          1단계 댓글인 경우 2단계 댓글의 수만 조회한다. ( 3단계 수는 가져오지 않는다. )
        */
          attributes: [
            "id",
            "commentContent",
            "createdAt",
            "updatedAt",
            "dltYsno",
            [
              sequelize.literal(
                '(SELECT COUNT("ParentId") FROM Comments WHERE `childComment.id` = Comments.ParentId)'
              ),
              "childCount",
            ],
          ],
          include: [
            {
              model: db.User,
              attributes: ["id", "email", "nickname"],
            },
          ],
          where: {
            ParentId: req.params.id,
          },
          order: [["id", "DESC"]],
        },
      ],
    });
    res.send(makeResponse(comments));
  } catch (err) {
    console.error(err);
    next(err);
  }
});

router.delete("/:id", isLoggedIn, async (req, res, next) => {
  try {
    await db.Comment.findOne({
      where: {
        id: req.params.id,
      },
    });
    await db.Comment.update(
      { dltYsno: "Y" },
      {
        where: {
          id: req.params.id,
        },
      }
    );
    res.send("삭제 되었습니다.");
  } catch (err) {
    console.error(err);
    next(err);
  }
});

module.exports = router;
