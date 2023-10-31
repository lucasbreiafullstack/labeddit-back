import { PostDatabase } from "../database/PostDataBase"
import { Post, PostDB, PostModel } from "../models/Post"
import { POST_LIKE, LikeOrDislikeDB } from "../models/LikePost"
import { NotFoundError } from "../errors/NotFoundError"
import { UnauthorizedError } from "../errors/UnauthorizedError"
import { IdGenerator } from "../services/idGenerator"
import { TokenManager } from "../services/TokenManager"
import { USER_ROLES } from "../models/User"
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/Posts/editPost.dto"
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/Posts/getPosts.dto"
import { CreatePostInputDTO, CreatePostOutputDTO } from "../dtos/Posts/createPost.dto"
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/Posts/deletePost.dto"
import { LikeOrDislikePostInputDTO, LikeOrDislikePostOutputDTO } from "../dtos/Posts/likeOrDislike.dto"

export class PostBusiness {

  constructor(
    private postDatabase: PostDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) { }

  // Método para criar uma postagem
  public createPost = async (
    input: CreatePostInputDTO
  ): Promise<CreatePostOutputDTO> => {
    const { content, token } = input

    const id = this.idGenerator.generate()
    const payload = this.tokenManager.getPayload(token)

    // Verifica se o token é inválido
    if (payload === null) {
      throw new UnauthorizedError("Token inválido")
    }

    // Cria uma nova postagem
    const newPost = new Post(
      id,
      content,
      0,
      0,
      0,
      new Date().toISOString(),
      "",
      payload.id,
      payload.username
    )

    // Formata os dados da postagem para o banco de dados
    const newPostDB: PostDB = {
      id: newPost.getId(),
      creator_id: newPost.getCreatorId(),
      content: newPost.getContent(),
      likes: newPost.getLikes(),
      comments: newPost.getComments(),
      dislikes: newPost.getDislikes(),
      created_at: newPost.getCreatedAt(),
      updated_at: newPost.getUpdatedAt()
    }

    // Insere a nova postagem no banco de dados
    await this.postDatabase.insertPost(newPostDB)

    // Formata a saída da postagem
    const output: PostModel = {
      id: newPost.getId(),
      content: newPost.getContent(),
      likes: newPost.getLikes(),
      dislikes: newPost.getDislikes(),
      comments: newPost.getComments(),
      createdAt: newPost.getCreatedAt(),
      updatedAt: newPost.getUpdatedAt(),
      creator: {
        id: newPost.getCreatorId(),
        username: newPost.getCreatorUsername()
      }
    }

    return output
  }

  // Método para obter postagens
  public getPosts = async (
    input: GetPostsInputDTO
  ): Promise<GetPostsOutputDTO> => {
    const { content, token } = input
    const payload = this.tokenManager.getPayload(token)

    // Verifica se o token é inválido
    if (payload === null) {
      throw new UnauthorizedError("Token inválido")
    }
    
    // Busca as postagens no banco de dados
    let postsDB = await this.postDatabase.findPosts(content)

    // Mapeia as postagens para o formato de saída
    const posts = postsDB.map((postWithCreator) => {
      const post = new Post(
        postWithCreator.id,
        postWithCreator.content,
        postWithCreator.likes,
        postWithCreator.dislikes,
        postWithCreator.comments,
        postWithCreator.created_at,
        postWithCreator.updated_at,
        postWithCreator.creator_id,
        postWithCreator.creator_username
      )

      return post.toBusinessModel()
    })

    const output: GetPostsOutputDTO = posts
    return output
  }

  // Método para editar uma postagem
  public editPost = async (
    input: EditPostInputDTO
  ): Promise<EditPostOutputDTO> => {
    const {
      idToEdit,
      content,
      token
    } = input

    const payload = this.tokenManager.getPayload(token)

    // Verifica se o token é inválido
    if (payload === null) {
      throw a UnauthorizedError("Token inválido")
    }

    if (!idToEdit) {
      throw new NotFoundError("Por favor, insira um id")
    }

    // Busca a postagem a ser editada no banco de dados
    const postToEditDB = await this.postDatabase.findPostById(idToEdit)

    if (!postToEditDB) {
      throw new NotFoundError("Post com suposto id não encontrado, insira um id válido")
    }

    // Cria uma instância da postagem para edição
    const post = new Post(
      postToEditDB.id,
      postToEditDB.content,
      postToEditDB.likes,
      postToEditDB.dislikes,
      postToEditDB.comments,
      postToEditDB.created_at,
      new Date().toISOString(),
      postToEditDB.creator_id,
      postToEditDB.creator_username
    )

    // Atualiza o conteúdo da postagem, se fornecido
    content && post.setContent(content)

    // Formata os dados atualizados da postagem
    const updatePostDB: PostDB = {
      id: post.getId(),
      creator_id: post.getCreatorId(),
      content: post.getContent(),
      likes: post.getLikes(),
      dislikes: post.getDislikes(),
      comments: post.getComments(),
      created_at: post.getCreatedAt(),
      updated_at: post.getUpdatedAt()
    }

    // Verifica se o usuário tem permissão para editar a postagem
    if (payload.role === USER_ROLES.ADMIN) {
      await this.postDatabase.updatePostById(idToEdit, updatePostDB)
    } else if (postToEditDB.creator_id === payload.id) {
      await this.postDatabase.updatePostById(idToEdit, updatePostDB)
    } else {
      throw new UnauthorizedError("Somente o administrador ou dono da postagem podem acessar este recurso.")
    }

    const output = {
      content: post.getContent()
    }

    return output
  }

  // Método para deletar uma postagem
  public deletePost = async (
    input: DeletePostInputDTO
  ): Promise<DeletePostOutputDTO> => {
    const { idToDelete, token } = input

    // Busca a postagem a ser deletada no banco de dados
    const postToDeleteDB = await this.postDatabase.findPostById(idToDelete)
    const payload = this.tokenManager.getPayload(token)

    // Verifica se o token é inválido
    if (payload === null) {
      throw new UnauthorizedError("Token inválido")
    }

    if (!idToDelete) {
      throw new NotFoundError("Por favor, insira um id")
    }

    if (!postToDeleteDB) {
      throw new NotFoundError("'ID' não encontrado")
    }

    // Verifica se o usuário tem permissão para deletar a postagem
    if (payload.role === USER_ROLES.ADMIN) {
      await this.postDatabase.deletePostById(idToDelete)
    } else if (postToDeleteDB.creator_id === payload.id) {
      await this.postDatabase.deletePostById(idToDelete)
    } else {
      throw new UnauthorizedError("Somente o administrador ou dono da postagem podem acessar este recurso.")
    }

    const output = {
      message: "Postagem deletada com sucesso",
    }
    return output
  }

  // Método para curtir ou descurtir uma postagem
  public likeOrDislikePost = async (
    input: LikeOrDislikePostInputDTO
  ): Promise<LikeOrDislikePostOutputDTO> => {
    const { postId, like, token } = input

    const payload = this.tokenManager.getPayload(token)

    // Verifica se o token é inválido
    if (payload === null) {
      throw new UnauthorizedError("Token inválido")
    }

    // Busca a postagem com o criador no banco de dados
    const postDBwithCreator = await this.postDatabase.findPostById(postId)

    if (!postDBwithCreator) {
      throw new NotFoundError("Post não encontrado")
    }

    // Cria uma instância da postagem para manipulação
    const post = new Post(
      postDBwithCreator.id,
      postDBwithCreator.content,
      postDBwithCreator.likes,
      postDBwithCreator.dislikes,
      postDBwithCreator.comments,
      postDBwithCreator.created_at,
      postDBwithCreator.updated_at,
      postDBwithCreator.creator_id,
      postDBwithCreator.creator_username,
    )

    // Converte a ação de curtir ou descurtir para um valor numérico (1 para curtir, 0 para descurtir)
    const likeSQL = like ? 1 : 0

    // Cria um objeto para registrar a ação de curtir/descurtir no banco de dados
    const likeDislikeDB: LikeOrDislikeDB = {
      user_id: payload.id,
      post_id: postId,
      like: likeSQL
    }

    // Verifica se o usuário já curtiu ou descurtiu a postagem
    const likeDislikeExists = await this.postDatabase.findLikeOrDislike(likeDislikeDB)

    // Lógica para lidar com ação de curtir ou descurtir existente
    if (likeDislikeExists === POST_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.postDatabase.deleteLikeOrDislike(likeDislikeDB)
        post.removeLike()
      } else {
        await this.postDatabase.updateLikeOrDislike(likeDislikeDB)
        post.removeLike()
        post.addDislike()
      }
    } else if (likeDislikeExists === POST_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.postDatabase.deleteLikeOrDislike(likeDislikeDB)
        post.removeDislike()
      } else {
        await this.postDatabase.updateLikeOrDislike(likeDislikeDB)
        post.removeDislike()
        post.addLike()
      }
    } else {
      // Se não houver registro de curtir/descurtir, cria um novo
      await this.postDatabase.insertLikeOrDislike(likeDislikeDB)
      like ? post.addLike() : post.addDislike()
    }

    // Atualiza os dados da postagem no banco de dados
    const updatedPostDB = post.toDBModel()
    await this.postDatabase.updatePostById(updatedPostDB.id, updatedPostDB)

    // Formata a saída com a contagem de curtidas e descurtidas
    const output: LikeOrDislikePostOutputDTO = {
      likes: post.getLikes(),
      dislikes: post.getDislikes()
    }

    return output
  }
};