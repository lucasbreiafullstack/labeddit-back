import { ZodError } from "zod"
import { PostDatabaseMock } from "../../mocks/PostDataBaseMock"
import { CommentBusiness } from "../../../src/business/CommentBusiness"
import { IdGeneratorMock } from "../../../tests/mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../../tests/mocks/TokenManagerMock"
import { CommentDatabaseMock } from "../../../tests/mocks/CommentDatabaseMock"
import { LikeOrDislikeCommentSchema } from "../../../src/dtos/Comments/likeOrDislike.dto"

describe("Testando likeOrDislikeComment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new PostDatabaseMock()
  )

  test("deve fazer uma busca pelo array de comentários e dar um like no comentário", async () => {
    // Prepara os dados de entrada para dar um like no comentário
    const input = LikeOrDislikeCommentSchema.parse({
      id: "comment01",
      like: true,
      token: "token-mock-astrodev"
    })

    // Chama o método para dar um like no comentário
    const output = await commentBusiness.likeOrDislikeComment(input)

    // Verifica se a contagem de likes e dislikes está correta após o like
    expect(output).toEqual({ "dislikes": 0, "likes": 1 })
  })

  test("deve fazer uma busca pelo array de comentários e dar um dislike no comentário", async () => {
    // Prepara os dados de entrada para dar um dislike no comentário
    const input = LikeOrDislikeCommentSchema.parse({
      id: "comment01",
      like: false,
      token: "token-mock-astrodev"
    })

    // Chama o método para dar um dislike no comentário
    const output = await commentBusiness.likeOrDislikeComment(input)

    // Verifica se a contagem de likes e dislikes está correta após o dislike
    expect(output).toEqual({ "dislikes": 1, "likes": 0 })
  })

  test("deve disparar erro na ausência de commentId", async () => {
    // Tenta dar like/dislike em um comentário sem especificar o "id"
    try {
      LikeOrDislikeCommentSchema.parse({
        id: "",
        like: true,
        token: "token-mock-astrodev"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("id: String must contain at least 1 character(s)")
      }
    }
  })

  test("deve disparar erro quando like não for boolean", async () => {
    // Tenta dar like/dislike em um comentário com o campo "like" sendo uma string
    try {
      LikeOrDislikeCommentSchema.parse({
        id: "comment01",
        like: "true",
        token: "token-mock-astrodev"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("like: Expected boolean, received string")
      }
    }
  })

  test("deve disparar erro na ausência de token", async () => {
    // Tenta dar like/dislike em um comentário sem especificar o "token"
    try {
      LikeOrDislikeCommentSchema.parse({
        id: "comment01",
        like: true,
        token: ""
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("token: String must contain at least 1 character(s)")
      }
    }
  })

  test("deve disparar erro na ausência do input commentId", async () => {
    // Tenta dar like/dislike em um comentário sem especificar o "id"
    try {
      LikeOrDislikeCommentSchema.parse({
        like: true,
        token: "token-mock-astrodev"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("id: Required")
      }
    }
  })

  test("deve disparar erro na ausência do input like", async () => {
    // Tenta dar like/dislike em um comentário sem especificar o "like"
    try {
      LikeOrDislikeCommentSchema.parse({
        id: "comment01",
        token: "token-mock-astrodev"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("like: Required")
      }
    }
  })

  test("deve disparar erro na ausência do input token", async () => {
    // Tenta dar like/dislike em um comentário sem especificar o "token"
    try {
      LikeOrDislikeCommentSchema.parse({
        id: "comment01",
        like: true
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("token: Required")
      }
    }
  })
});