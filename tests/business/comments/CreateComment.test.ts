import { CommentBusiness } from "../../../src/business/CommentBusiness"
import { ZodError } from "zod"
import { CreateCommentSchema } from "../../../src/dtos/Comments/createComment.dto"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock"
import { PostDatabaseMock } from "../../mocks/PostDataBaseMock"

describe("Testando create comment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new PostDatabaseMock()
  )

  test("deve criar um comentário novo", async () => {
    // Prepara os dados de entrada para criar um comentário
    const input = CreateCommentSchema.parse({
      content: "Novo comentário",
      postId: "post01",
      token: "token-mock-astrodev"
    })

    // Chama o método para criar um comentário
    const output = await commentBusiness.createComment(input)

    // Verifica se o comentário foi criado com sucesso
    expect(output).toEqual({
      id: "id-mock",
      postId: "post01",
      content: "Novo comentário",
      likes: 0,
      dislikes: 0,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      creator: {
        id: "id-mock-astrodev",
        username: "Astrodev"
      }
    })
  })

  test("deve disparar erro na ausência de content", async () => {
    // Tenta criar um comentário sem o campo "content"
    try {
      CreateCommentSchema.parse({
        content: "",
        postId: "post01",
        token: "token-mock-astrodev"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("content: String must contain at least 1 character(s)")
      }
    }
  })

  test("deve disparar erro na ausência de token", async () => {
    // Tenta criar um comentário sem o campo "token"
    try {
      CreateCommentSchema.parse({
        content: "aaaa",
        postId: "post01",
        token: ""
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("token: String must contain at least 1 character(s)")
      }
    }
  })

  test("deve disparar erro na ausência do input content", async () => {
    // Tenta criar um comentário sem o campo "content"
    try {
      CreateCommentSchema.parse({
        postId: "post01",
        token: "token-mock-astrodev"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("content: Required")
      }
    }
  })

  test("deve disparar erro na ausência do input token", async () => {
    // Tenta criar um comentário sem o campo "token"
    try {
      CreateCommentSchema.parse({
        content: "novo comentário",
        postId: "post01"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("token: Required")
      }
    }
  })
})
