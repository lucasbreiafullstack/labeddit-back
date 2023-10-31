import { Request, Response } from "express"
import { UserBusiness } from "../business/UserBusiness"
import { BaseError } from "../errors/BaseError"
import { ZodError } from "zod"
import { EditUserSchema } from "../dtos/Users/editUser.dto"
import { SignupSchema } from "../dtos/Users/signup.dto"
import { LoginSchema } from "../dtos/Users/login.dto"
import { GetUsersSchema } from "../dtos/Users/getUsers.dto"
import { DeleteUserSchema } from "../dtos/Users/deleteUser.dto"
import { NotFoundError } from "../errors/NotFoundError"

export class UserController {

  constructor(private userBusiness: UserBusiness) { }

  // Método para obter usuários
  public getUsers = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = GetUsersSchema.parse({
        username: req.body.username,
        token: req.headers.authorization
      })

      // Chama o método do negócio para obter usuários
      const output = await this.userBusiness.getUsers(input)

      // Verifica se a saída está vazia e lança um erro NotFound se for o caso
      if (!output) {
        res.statusCode = 400
        throw new NotFoundError()
      }

      // Responde com a lista de usuários obtida
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

  // Método para criar um novo usuário (signup)
  public signup = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = SignupSchema.parse({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
      })

      // Chama o método do negócio para criar o usuário
      const output = await this.userBusiness.signup(input)

      // Responde com os detalhes do usuário criado
      res.status(201).send(output)
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(`${error.issues[0].path}: ${error.issues[0].message}`)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Usuário já cadastrado")
      }
    }
  }

  // Método para autenticar um usuário (login)
  public login = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = LoginSchema.parse({
        email: req.body.email,
        password: req.body.password
      })

      // Chama o método do negócio para autenticar o usuário
      const output = await this.userBusiness.login(input)

      // Responde com os detalhes do usuário autenticado
      res.status(200).send(output)
      
    } catch (error) {
      console.log(error)

      if (error instanceof ZodError) {
        res.status(400).send(`${error.issues[0].path}: ${error.issues[0].message}`)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      } else {
        res.status(500).send("Usuário não cadastrado")
      }
    }
  }

  // Método para editar um usuário por ID
  public editUser = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = EditUserSchema.parse({
        idToEdit: req.params.id,
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        token: req.headers.authorization
      })

      // Chama o método do negócio para editar o usuário
      const output = await this.userBusiness.editUserById(input)

      // Verifica se a saída está vazia e lança um erro NotFound se for o caso
      if (!output) {
        res.statusCode = 400
        throw new NotFoundError("Id inválido")
      }

      // Responde com os detalhes do usuário editado
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

  // Método para deletar um usuário por ID
  public deleteUser = async (req: Request, res: Response) => {
    try {
      // Valida e extrai os parâmetros da solicitação
      const input = DeleteUserSchema.parse({
        idToDelete: req.params.id,
        token: req.headers.authorization
      })

      // Chama o método do negócio para deletar o usuário
      const output = await this.userBusiness.deleteUserById(input)

      // Verifica se a saída está vazia e lança um erro NotFound se for o caso
      if (!output) {
        res.statusCode = 400
        throw new NotFoundError("Id inválido")
      }

      // Responde com a confirmação da exclusão
      res.status(200).send(output)

    } catch (error) {
      if (error instanceof ZodError) {
        res.status(400).send(`${error.issues[0].path}: ${error.issues[0].message}`)
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message)
      }
    }
  }
};