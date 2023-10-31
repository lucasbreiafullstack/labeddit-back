import { USER_ROLES } from "../models/User"
import { PostDB, Post } from "../models/Post"
import { PostDatabase } from "../database/PostDataBase"
import { NotFoundError } from "../errors/NotFoundError"
import { IdGenerator } from "../services/idGenerator"
import { TokenManager } from "../services/TokenManager"
import { CommentDatabase } from "../database/CommentDatabase"
import { UnauthorizedError } from "../errors/UnauthorizedError"
import { Comment, CommentDB, CommentModel } from "../models/Comment"
import { COMMENT_LIKE, LikeOrDislikeDB } from "../models/LikeComment"
import { GetCommentsInputDTO, GetCommentsOutputDTO } from "../dtos/Comments/getComments.dto"
import { CreateCommentInputDTO, CreateCommentOutputDTO } from "../dtos/Comments/createComment.dto"
import { DeleteCommentInputDTO, DeleteCommentOutputDTO } from "../dtos/Comments/deleteComment.dto"
import { LikeOrDislikeCommentInputDTO, LikeOrDislikeCommentOutputDTO } from "../dtos/Comments/likeOrDislike.dto"

export class CommentBusiness {

  constructor(
    private CommentDatabase: CommentDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager,
    private PostDatabase: PostDatabase
  ) { }

  // Método para obter comentários
  public getComments = async (
    input: GetCommentsInputDTO
  ): Promise<GetCommentsOutputDTO> => {
    const { content, token } = input
    const payload = this.tokenManager.getPayload(token)

    // Verifica se o token é inválido
    if (payload === null) {
      throw new UnauthorizedError("Token inválido")
    }

    // Busca os comentários no banco de dados
    let CommentsDB = await this.CommentDatabase.findComments(content)

    // Mapeia os comentários para o formato de saída
    const Comments = CommentsDB.map(CommentWithCreator => {
      const comment = new Comment(
        CommentWithCreator.id,
        CommentWithCreator.post_id,
        CommentWithCreator.content,
        CommentWithCreator.likes,
        CommentWithCreator.dislikes,
        CommentWithCreator.created_at,
        CommentWithCreator.updated_at,
        CommentWithCreator.creator_id,
        CommentWithCreator.creator_username
      )

      return comment.toBusinessModel()
    })

    const output: GetCommentsOutputDTO = Comments
    return output
  }

  // Método para criar um comentário
  public createComment = async (
    input: CreateCommentInputDTO
  ): Promise<CreateCommentOutputDTO> => {
    const { postId, content, token } = input

    // Gera um ID para o comentário
    const id = this.idGenerator.generate()
    const payload = this.tokenManager.getPayload(token)
    const postDB = await this.PostDatabase.findPostById(postId)

    // Verifica se o token é inválido
    if (payload === null) {
      throw new UnauthorizedError("Token inválido")
    }

    // Cria um novo comentário
    const newComment = new Comment(
      id,
      postId,
      content,
      0,
      0,
      new Date().toISOString(),
      "",
      payload.id,
      payload.username
    )

    // Atualiza o post com o novo comentário
    const post = new Post(
      postDB.id,
      postDB.content,
      postDB.likes,
      postDB.dislikes,
      postDB.comments,
      postDB.created_at,
      postDB.updated_at,
      postDB.creator_id,
      postDB.creator_username
    )

    post.addComment()

    const newCommentDB: CommentDB = {
      id: newComment.getId(),
      post_id: newComment.getPostId(),
      creator_id: newComment.getCreatorId(),
      content: newComment.getContent(),
      likes: newComment.getLikes(),
      dislikes: newComment.getDislikes(),
      created_at: newComment.getCreatedAt(),
      updated_at: newComment.getUpdatedAt(),
    }

    const updatedPostDB: PostDB = {
      id: postId,
      creator_id: post.getCreatorId(),
      content: post.getContent(),
      likes: post.getLikes(),
      dislikes: post.getDislikes(),
      comments: post.getComments(),
      created_at: post.getCreatedAt(),
      updated_at: post.getUpdatedAt(),
    }

    // Insere o novo comentário no banco de dados
    await this.CommentDatabase.insertComment(newCommentDB)
    // Atualiza o post no banco de dados
    await this.PostDatabase.updatePostById(postId, updatedPostDB)

    // Formata o comentário de saída
    const output: CommentModel = {
      id: newComment.getId(),
      postId: newComment.getPostId(),
      content: newComment.getContent(),
      likes: newComment.getLikes(),
      dislikes: newComment.getDislikes(),
      createdAt: newComment.getCreatedAt(),
      updatedAt: newComment.getUpdatedAt(),
      creator: {
        id: newComment.getCreatorId(),
        username: newComment.getCreatorUsername()
      }
    }

    return output
  }

  // Método para deletar um comentário
  public deleteComment = async (
    input: DeleteCommentInputDTO
  ): Promise<DeleteCommentOutputDTO> => {
    const { idToDelete, token } = input

    // Busca o comentário a ser deletado no banco de dados
    const commentToDeleteDB = await this.CommentDatabase.findCommentById(idToDelete)
    const payload = this.tokenManager.getPayload(token)

    // Verifica se o token é inválido
    if (payload === null) {
      throw new UnauthorizedError("Token inválido")
    }

    if (!idToDelete) {
      throw new NotFoundError("Por favor, insira um ID")
    }

    if (!commentToDeleteDB) {
      throw new NotFoundError("'ID' não encontrado")
    }

    // Verifica se o usuário tem permissão para deletar o comentário
    if (payload.role === USER_ROLES.ADMIN) {
      await this.CommentDatabase.deleteCommentById(idToDelete)
    } else if (commentToDeleteDB.creator_id === payload.id) {
      await this.CommentDatabase.deleteCommentById(idToDelete)
    } else {
      throw new UnauthorizedError("Somente o administrador ou dono do tópico podem acessar este recurso.")
    }

    const output = {
      message: "Comentário deletado com sucesso",
    }
    return output
  }

  // Método para curtir ou descurtir um comentário
  public likeOrDislikeComment = async (
    input: LikeOrDislikeCommentInputDTO
  ): Promise<LikeOrDislikeCommentOutputDTO> => {
    const { id, like, token } = input

    const payload = this.tokenManager.getPayload(token)

    // Verifica se o token é inválido
    if (payload === null) {
      throw new UnauthorizedError("Token inválido")
    }

    // Busca o comentário no banco de dados
    const CommentDBwithCreator = await this.CommentDatabase.findCommentById(id)

    if (!CommentDBwithCreator) {
      throw new NotFoundError("Comentário não encontrado")
    }

    const comment = new Comment(
      CommentDBwithCreator.id,
      CommentDBwithCreator.post_id,
      CommentDBwithCreator.content,
      CommentDBwithCreator.likes,
      CommentDBwithCreator.dislikes,
      CommentDBwithCreator.created_at,
      CommentDBwithCreator.updated_at,
      CommentDBwithCreator.creator_id,
      CommentDBwithCreator.creator_username,
    )

    const likeSQL = like ? 1 : 0

    const likeDislikeDB: LikeOrDislikeDB = {
      user_id: payload.id,
      comment_id: id,
      like: likeSQL
    }

    const likeDislikeExists = await this.CommentDatabase.findLikeOrDislike(likeDislikeDB)

    if (likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED) {
      if (like) {
        await this.CommentDatabase.deleteLikeOrDislike(likeDislikeDB)
        comment.removeLike()
      } else {
        await this.CommentDatabase.updateLikeOrDislike(likeDislikeDB)
        comment.removeLike()
        comment.addDislike()
      }

    } else if (likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED) {
      if (like === false) {
        await this.CommentDatabase.deleteLikeOrDislike(likeDislikeDB)
        comment.removeDislike()
      } else {
        await this.CommentDatabase.updateLikeOrDislike(likeDislikeDB)
        comment.removeDislike()
        comment.addLike()
      }

    } else {
      await this.CommentDatabase.insertLikeOrDislike(likeDislikeDB)
      like ? comment.addLike() : comment.addDislike()
    }

    const updatedCommentDB = comment.toDBModel()
    await this.CommentDatabase.updateCommentById(updatedCommentDB.id, updatedCommentDB)

    const output: LikeOrDislikeCommentOutputDTO = {
      likes: comment.getLikes(),
      dislikes: comment.getDislikes()
    }

    return output
  }
};