import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDataBase";
import { PostDatabase } from "./PostDataBase";
import { LikeOrDislikeDB, COMMENT_LIKE } from "../models/LikeComment";
import { CommentDB, CommentDBWithCreator } from "../models/Comment";

export class CommentDatabase extends BaseDatabase {

  public static TABLE_COMMENTS = "comments";
  public static TABLE_LIKES_DISLIKES = "likes_dislikes_comments";

  // Método para inserir um novo comentário
  public insertComment = async (newCommentDB: CommentDB): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .insert(newCommentDB)
  }

  // Método para encontrar comentários com uma pesquisa opcional
  public findComments = async (q: string | undefined): Promise<CommentDBWithCreator[]> => {
    let commentsDB;

    if (q) {
      const result: Array<CommentDBWithCreator> = await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .select(
          `${CommentDatabase.TABLE_COMMENTS}.id`,
          `${CommentDatabase.TABLE_COMMENTS}.post_id`,
          `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
          `${CommentDatabase.TABLE_COMMENTS}.content`,
          `${CommentDatabase.TABLE_COMMENTS}.likes`,
          `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
          `${CommentDatabase.TABLE_COMMENTS}.created_at`,
          `${CommentDatabase.TABLE_COMMENTS}.updated_at`,
          `${UserDatabase.TABLE_USERS}.username as creator_username`
        )
        .join(
          `${UserDatabase.TABLE_USERS}`,
          `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
          "=",
          `${UserDatabase.TABLE_USERS}.id`
        ).join(
          `${PostDatabase.TABLE_POSTS}`,
          `${CommentDatabase.TABLE_COMMENTS}.post_id`,
          "=",
          `${PostDatabase.TABLE_POSTS}.id`
        ).where(`${CommentDatabase.TABLE_COMMENTS}.content`, "LIKE", `%${q}%`)

      commentsDB = result

    } else {
      const result: Array<CommentDBWithCreator> = await BaseDatabase
        .connection(CommentDatabase.TABLE_COMMENTS)
        .select(
          `${CommentDatabase.TABLE_COMMENTS}.id`,
          `${CommentDatabase.TABLE_COMMENTS}.post_id`,
          `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
          `${CommentDatabase.TABLE_COMMENTS}.content`,
          `${CommentDatabase.TABLE_COMMENTS}.likes`,
          `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
          `${CommentDatabase.TABLE_COMMENTS}.created_at`,
          `${CommentDatabase.TABLE_COMMENTS}.updated_at`,
          `${UserDatabase.TABLE_USERS}.username as creator_username`
        )
        .join(
          `${UserDatabase.TABLE_USERS}`,
          `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
          "=",
          `${UserDatabase.TABLE_USERS}.id`
        ).join(
          `${PostDatabase.TABLE_POSTS}`,
          `${CommentDatabase.TABLE_COMMENTS}.post_id`,
          "=",
          `${PostDatabase.TABLE_POSTS}.id`
        )

      commentsDB = result
    }

    return commentsDB
  }

  // Método para encontrar um comentário por ID
  public findCommentById = async (id: string): Promise<CommentDBWithCreator> => {
    const [result] = await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .select(
        `${CommentDatabase.TABLE_COMMENTS}.id`,
        `${CommentDatabase.TABLE_COMMENTS}.post_id`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        `${CommentDatabase.TABLE_COMMENTS}.content`,
        `${CommentDatabase.TABLE_COMMENTS}.likes`,
        `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
        `${CommentDatabase.TABLE_COMMENTS}.created_at`,
        `${CommentDatabase.TABLE_COMMENTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.username as creator_username`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      ).join(
        `${PostDatabase.TABLE_POSTS}`,
        `${CommentDatabase.TABLE_COMMENTS}.post_id`,
        "=",
        `${PostDatabase.TABLE_POSTS}.id`
      )
      .where({ [`${CommentDatabase.TABLE_COMMENTS}.id`]: id })

    return result as CommentDBWithCreator
  }

  // Método para encontrar o criador de um comentário por ID
  public findCommentCreatorById = async (id: string): Promise<CommentDBWithCreator | undefined> => {
    const [result] = await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .select(
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        `${UserDatabase.TABLE_USERS}.username as creator_username`,
        `${CommentDatabase.TABLE_COMMENTS}.content`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      ).join(
        `${PostDatabase.TABLE_POSTS}`,
        `${CommentDatabase.TABLE_COMMENTS}.post_id`,
        "=",
        `${PostDatabase.TABLE_POSTS}.id`
      ).where({ creator_id: id })

    return result as CommentDBWithCreator | undefined
  }

  // Método para atualizar um comentário por ID
  public updateCommentById = async (id: string, commentDB: CommentDB): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .update(commentDB)
      .where({ id: id })
  }

  // Método para deletar um comentário por ID
  public deleteCommentById = async (idToDelete: string): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .delete()
      .where({ id: idToDelete })
  }

  // Método para obter o status de like ou dislike de um comentário
  public likeOrDislikeComment = async (id: string): Promise<CommentDB | undefined> => {
    const [result] = await BaseDatabase
      .connection(CommentDatabase.TABLE_COMMENTS)
      .select(
        `${CommentDatabase.TABLE_COMMENTS}.id`,
        `${CommentDatabase.TABLE_COMMENTS}.post_id`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        `${CommentDatabase.TABLE_COMMENTS}.content`,
        `${CommentDatabase.TABLE_COMMENTS}.likes`,
        `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
        `${CommentDatabase.TABLE_COMMENTS}.created_at`,
        `${CommentDatabase.TABLE_COMMENTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.username as creator_username`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      ).where({ [`${CommentDatabase.TABLE_COMMENTS}.id`]: id })

    return result as CommentDB | undefined
  }

  // Método para encontrar o status de like ou dislike de um usuário para um comentário
  public findLikeOrDislike = async (likeOrDislikeDB: LikeOrDislikeDB): Promise<COMMENT_LIKE | undefined> => {
    const [result]: Array<LikeOrDislikeDB | undefined> = await BaseDatabase
      .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
      .select()
      .where({
        user_id: likeOrDislikeDB.user_id,
        comment_id: likeOrDislikeDB.comment_id
      })

    if (result === undefined) {
      return undefined
    } else if (result.like === 1) {
      return COMMENT_LIKE.ALREADY_LIKED
    } else {
      return COMMENT_LIKE.ALREADY_DISLIKED
    }
  }

  // Método para excluir o status de like ou dislike de um usuário para um comentário
  public deleteLikeOrDislike = async (likeOrDislikeDB: LikeOrDislikeDB): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
      .delete()
      .where({
        user_id: likeOrDislikeDB.user_id,
        comment_id: likeOrDislikeDB.comment_id
      })
  }

  // Método para atualizar o status de like ou dislike de um usuário para um comentário
  public updateLikeOrDislike = async (likeOrDislikeDB: LikeOrDislikeDB): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
      .update(likeOrDislikeDB)
      .where({
        user_id: likeOrDislikeDB.user_id,
        comment_id: likeOrDislikeDB.comment_id
      })
  }

  // Método para inserir o status de like ou dislike de um usuário para um comentário
  public insertLikeOrDislike = async (likeOrDislikeDB: LikeOrDislikeDB): Promise<void> => {
    await BaseDatabase
      .connection(CommentDatabase.TABLE_LIKES_DISLIKES)
      .insert(likeOrDislikeDB)
  }
};