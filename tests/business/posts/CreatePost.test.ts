import { ZodError } from 'zod'
import { PostBusiness } from "../../../src/business/PostBusiness"
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock"
import { TokenManagerMock } from "../../mocks/TokenManagerMock"
import { PostDatabaseMock } from "../../mocks/PostDataBaseMock"
import { CreatePostSchema } from "../../../src/dtos/Posts/createPost.dto"

describe("Testando createPost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  )

  test("deve criar uma postagem nova", async () => {
    // Prepara os dados de entrada para criar uma nova postagem
    const input = CreatePostSchema.parse({
      content: "Nova postagem",
      token: "token-mock-astrodev"
    })

    // Chama o método para criar uma nova postagem
    const output = await postBusiness.createPost(input)

    // Verifica se a postagem foi criada com sucesso e os campos estão corretos
    expect(output).toEqual({
      id: "id-mock",
      content: "Nova postagem",
      likes: 0,
      dislikes: 0,
      comments: 0,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      creator: {
        id: "id-mock-astrodev",
        username: "Astrodev"
      }
    })
  })

  test("deve disparar erro na ausência de content", async () => {
    // Tenta criar uma postagem sem especificar o conteúdo (campo "content")
    try {
      CreatePostSchema.parse({
        content: "",
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
    // Tenta criar uma postagem sem especificar o token
    try {
      CreatePostSchema.parse({
        content: "aaaa",
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
    // Tenta criar uma postagem sem especificar o conteúdo (campo "content")
    try {
      CreatePostSchema.parse({
        token: "token-mock-fulano"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("content: Required")
      }
    }
  })

  test("deve disparar erro na ausência do input token", async () => {
    // Tenta criar uma postagem sem especificar o token
    try {
      CreatePostSchema.parse({
        content: "aaaa"
      })
    } catch (error) {
      if (error instanceof ZodError) {
        // Verifica se a validação do schema gerou o erro esperado
        expect(error.issues[0].message).toEqual("token: Required")
      }
    }
  })
});