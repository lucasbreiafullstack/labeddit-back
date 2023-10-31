import { Request, Response } from "express"
import { CommentBusiness } from "../business/CommentBusiness"
import { BaseError } from "../errors/BaseError"
import { ZodError } from "zod"
import { GetCommentsSchema } from "../dtos/Comments/getComments.dto"
import { CreateCommentSchema } from "../dtos/Comments/createComment.dto"
import { DeleteCommentSchema } from "../dtos/Comments/deleteComment.dto"
import { LikeOrDislikeCommentSchema } from "../dtos/Comments/likeOrDislike.dto"

export class CommentController {

  constructor(private commentBusiness: CommentBusiness) { }

  // Método para obter comentários
  public getComments = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = GetCommentsSchema.parse({
        content: req.body.content,
        token: req.headers.authorization
      })

      // Chama o método do negócio para obter os comentários
      const output = await this.commentBusiness.getComments(input)

      // Responde com os comentários obtidos
      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(`${error.issues[0].path}: ${error.issues[0].message}`)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  // Método para criar um novo comentário
  public createComment = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = CreateCommentSchema.parse({
        postId: req.body.postId,
        content: req.body.content,
        token: req.headers.authorization
      })

      // Chama o método do negócio para criar o comentário
      const output = await this.commentBusiness.createComment(input)

      // Responde com o comentário criado
      res.status(201).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(`${error.issues[0].path}: ${error.issues[0].message}`)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  // Método para deletar um comentário por ID
  public deleteCommentById = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = DeleteCommentSchema.parse({
        idToDelete: req.params.id,
        token: req.headers.authorization
      })

      // Chama o método do negócio para deletar o comentário
      const output = await this.commentBusiness.deleteComment(input)

      // Responde com a confirmação da exclusão
      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(`${error.issues[0].path}: ${error.issues[0].message}`)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }

  // Método para dar like ou dislike a um comentário
  public likeOrDislikeComment = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = LikeOrDislikeCommentSchema.parse({
        id: req.params.id,
        like: req.body.like,
        token: req.headers.authorization
      })

      // Chama o método do negócio para dar like ou dislike ao comentário
      const output = await this.commentBusiness.likeOrDislikeComment(input)

      // Responde com o número atualizado de likes e dislikes
      res.status(200).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(`${error.issues[0].path}: ${error.issues[0].message}`)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Erro inesperado")
      }
    }
  }
};