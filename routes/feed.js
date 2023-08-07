const express = require("express");
const validator = require("express-validator");

const feedController = require("../controllers/feed");

const isAuth = require('../middleware/is-auth')

const router = express.Router();

// GET/feed/posts
router.get("/posts", isAuth,  feedController.getPosts);

// POST/feed/posts
router.post(
  "/post",
  isAuth,
  [
    validator.body("title").trim().isLength({ min: 7 }),
    validator.body("content").trim().isLength({ min: 5 }),
  ],
  feedController.createPost
);

router.get("/post/:postId",isAuth, feedController.getPost);

router.put(
  "/post/:postId",
  isAuth,
  [
    validator.body("title").trim().isLength({ min: 7 }),
    validator.body("content").trim().isLength({ min: 5 }),
  ],
  feedController.updatePost
);

router.delete(
  "/posts/:postId",
  isAuth,

  feedController.deletePost
);

module.exports = router;
