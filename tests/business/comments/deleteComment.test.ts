import { CommentBusiness } from "../../../src/business/CommentBusiness"
import { DeleteCommentSchema } from "../../../src/dtos/Comments/deleteComment.dto"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { ZodError } from "zod"
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock"
import { PostDatabaseMock } from "../../mocks/PostDataBaseMock"

describe("Testando delete comment", () => {
  const commentBusiness = new CommentBusiness(
    new CommentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new PostDatabaseMock()
  )

  test("deve deletar um comentário", async () => {
    // Prepara os dados de entrada para deletar um comentário
    const input = DeleteCommentSchema.parse({
      idToDelete: "comment01",
      postId: "post01",
      token: "token-mock-fulano"
    })

    // Chama o método para deletar um comentário
    const output = await commentBusiness.deleteComment(input)

    // Verifica se o comentário foi deletado com sucesso
    expect(output).toEqual({ message: "Comentário deletado com sucesso" })
  })

  test("deve disparar erro na ausência de idToDelete", async () => {
    // Tenta deletar um comentário sem o campo "idToDelete"
    try {
      DeleteCommentSchema.parse({
        idToDelete: "",
        postId: "post01",
        token: "token-mock-astrodev"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("idToDelete: String must contain at least 1 character(s)")
      }
    }
  })

  test("deve disparar erro na ausência de token", async () => {
    // Tenta deletar um comentário sem o campo "token"
    try {
      DeleteCommentSchema.parse({
        idToDelete: "comment01",
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

  test("deve disparar erro na ausência de postId", async () => {
    // Tenta deletar um comentário sem o campo "postId"
    try {
      DeleteCommentSchema.parse({
        idToDelete: "comment01",
        postId: "",
        token: "token-mock-astrodev"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("postId: String must contain at least 1 character(s)")
      }
    }
  })

  test("deve disparar erro na ausência do input idToDelete", async () => {
    // Tenta deletar um comentário sem o campo "idToDelete"
    try {
      DeleteCommentSchema.parse({
        postId: "post01",
        token: "token-mock-astrodev"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("idToDelete: Required")
      }
    }
  })

  test("deve disparar erro na ausência do input postId", async () => {
    // Tenta deletar um comentário sem o campo "postId"
    try {
      DeleteCommentSchema.parse({
        idToDelete: "comment01",
        token: "token-mock-astrodev"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("postId: Required")
      }
    }
  })

  test("deve disparar erro na ausência do input token", async () => {
    // Tenta deletar um comentário sem o campo "token"
    try {
      DeleteCommentSchema.parse({
        idToDelete: "comment01",
        postId: "post01"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("token: Required")
      }
    }
  })
});