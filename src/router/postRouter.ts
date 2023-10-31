import express from "express";
import { PostBusiness } from "../business/PostBusiness";
import { LikesDislikesDatabase } from "../database/LikesDislikesDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { PostController } from "../controller/PostController";
import { CommentDatabase } from "../database/CommentDatabase";
import { TokenManager } from "../services/tokenManager";
import { IdGenerator } from "../services/IdGenerator";

export const postRouter = express.Router();

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new LikesDislikesDatabase(),
        new CommentDatabase(),
        new TokenManager(),
        new IdGenerator()
    )
);

postRouter.post('/', postController.createPost);
postRouter.get('/', postController.getPosts);
postRouter.put('/:id', postController.updatePost);
postRouter.delete('/:id', postController.deletePost);
postRouter.put('/:id/like', postController.likeDislikePost);
postRouter.post('/:id/comment', postController.createComment);