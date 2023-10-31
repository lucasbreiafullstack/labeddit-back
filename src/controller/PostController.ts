import { Request, Response } from "express";
import { ZodError } from "zod";
import { PostBusiness } from "../business/PostBusiness";
import { CreatePostSchema } from "../dtos/post/CreatePost.dto";
import { BaseError } from "../errors/BaseError";
import { GetPostSchema } from "../dtos/post/getPosts.dto";
import { EditPostSchema } from "../dtos/post/EditPost.dto";
import { DeletePostSchema } from "../dtos/post/deletePost.dto";
import { LikeDislikeSchema } from "../dtos/post/likeDislikePost.dto";
import { CreateCommentSchema } from "../dtos/comment/comment.dto";

export class PostController{
    constructor(
        private postBusiness: PostBusiness
    ){}

    public createPost = async (req:Request, res: Response) => {
        try {
            const input = CreatePostSchema.parse({
                content: req.body.content,
                token: req.headers.authorization
            });

            const output = await this.postBusiness.createPost(input);

            res.status(200).send(output)
        } catch (error) {
            console.log(error);

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

    public getPosts = async (req: Request, res: Response) => {
        try {
            const input = GetPostSchema.parse({
                token: req.headers.authorization
            });

            const output = await this.postBusiness.getPosts(input);

            res.status(200).send(output)
        } catch (error) {
            console.log(error);

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

    public updatePost = async (req: Request, res: Response) => {
        try {
            const input = EditPostSchema.parse({
                id: req.params.id,
                content: req.body.content,
                token: req.headers.authorization
            });

            const output = await this.postBusiness.UpdatePost(input);

            res.status(200).send(output)
        } catch (error) {
            console.log(error);

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

    public deletePost = async (req: Request, res: Response) => {
        try {
            const input = DeletePostSchema.parse({
                id: req.params.id,
                token: req.headers.authorization
            });

            await this.postBusiness.deletePost(input);

            res.status(200).send()
        } catch (error) {
            console.log(error);

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

    public likeDislikePost = async (req: Request, res: Response) => {
        try {
            const input = LikeDislikeSchema.parse({
                id: req.params.id,
                like: req.body.like,
                token: req.headers.authorization
            });

            const output = await this.postBusiness.likeDislikePost(input);
            
            res.status(200).send()
        } catch (error) {
            console.log(error);

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    };

    public createComment = async (req: Request, res: Response) => {
        try {
            const input = CreateCommentSchema.parse({
                id: req.params.id,
                content: req.body.content,
                token: req.headers.authorization
            });

            const output = await this.postBusiness.createComment(input);

            res.status(200).send(output)
        } catch (error) {
            console.log(error);

            if(error instanceof ZodError){
                res.status(400).send(error.issues)
            }else if(error instanceof BaseError){
                res.status(error.statusCode).send(error.message)
            }else{
                res.status(500).send('Unexpected error.')
            }
        }
    }
}