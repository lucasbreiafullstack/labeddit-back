import { Request, Response } from "express"
import { PostBusiness } from "../business/PostBusiness"
import { BaseError } from "../errors/BaseError"
import { ZodError } from "zod"
import { EditPostSchema } from "../dtos/Posts/editPost.dto"
import { GetPostsSchema } from "../dtos/Posts/getPosts.dto"
import { CreatePostSchema } from "../dtos/Posts/createPost.dto"
import { DeletePostSchema } from "../dtos/Posts/deletePost.dto";
import { LikeOrDislikePostSchema } from "../dtos/Posts/likeOrDislike.dto"

export class PostController {

  constructor(private postBusiness: PostBusiness) { }

  // Método para obter postagens
  public getPosts = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = GetPostsSchema.parse({
        content: req.body.content,
        token: req.headers.authorization
      })

      // Chama o método do negócio para obter as postagens
      const output = await this.postBusiness.getPosts(input)

      // Responde com as postagens obtidas
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

  // Método para criar uma nova postagem
  public createPost = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = CreatePostSchema.parse({
        content: req.body.content,
        token: req.headers.authorization
      })

      // Chama o método do negócio para criar a postagem
      const output = await this.postBusiness.createPost(input)

      // Responde com a postagem criada
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

  // Método para editar uma postagem por ID
  public editPostById = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = EditPostSchema.parse({
        idToEdit: req.params.id,
        content: req.body.content,
        token: req.headers.authorization
      })

      // Chama o método do negócio para editar a postagem
      const output = await this.postBusiness.editPost(input)

      // Responde com os detalhes da postagem editada
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

  // Método para deletar uma postagem por ID
  public deletePostById = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = DeletePostSchema.parse({
        idToDelete: req.params.id,
        token: req.headers.authorization
      })

      // Chama o método do negócio para deletar a postagem
      const output = await this.postBusiness.deletePost(input)

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

  // Método para dar like ou dislike a uma postagem
  public likeOrDislikePost = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = LikeOrDislikePostSchema.parse({
        postId: req.params.id,
        like: req.body.like,
        token: req.headers.authorization
      })

      // Chama o método do negócio para dar like ou dislike à postagem
      const output = await this.postBusiness.likeOrDislikePost(input)

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