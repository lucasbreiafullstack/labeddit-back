import { LikeOrDislikeDB, POST_LIKE } from "../models/LikePost";
import { PostDB, PostDBWithCreator, PostModel } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDataBase";

export class PostDatabase extends BaseDatabase {

  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES = "likes_dislikes_posts";

  // Método para inserir um novo post
  public insertPost = async (newPostDB: PostDB): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .insert(newPostDB)
  }

  // Método para encontrar posts com uma pesquisa opcional
  public findPosts = async (q: string | undefined): Promise<PostDBWithCreator[]> => {
    let postsDB;

    if (q) {
      const result: Array<PostDBWithCreator> = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .select(
          `${PostDatabase.TABLE_POSTS}.id`,
          `${PostDatabase.TABLE_POSTS}.creator_id`,
          `${PostDatabase.TABLE_POSTS}.content`,
          `${PostDatabase.TABLE_POSTS}.likes`,
          `${PostDatabase.TABLE_POSTS}.dislikes`,
          `${PostDatabase.TABLE_POSTS}.comments`,
          `${PostDatabase.TABLE_POSTS}.created_at`,
          `${PostDatabase.TABLE_POSTS}.updated_at`,
          `${UserDatabase.TABLE_USERS}.username as creator_username`
        )
        .join(
          `${UserDatabase.TABLE_USERS}`,
          `${PostDatabase.TABLE_POSTS}.creator_id`,
          "=",
          `${UserDatabase.TABLE_USERS}.id`
        ).where(`${PostDatabase.TABLE_POSTS}.content`, "LIKE", `%${q}%`)

      postsDB = result

    } else {
      const result: Array<PostDBWithCreator> = await BaseDatabase
        .connection(PostDatabase.TABLE_POSTS)
        .select(
          `${PostDatabase.TABLE_POSTS}.id`,
          `${PostDatabase.TABLE_POSTS}.creator_id`,
          `${PostDatabase.TABLE_POSTS}.content`,
          `${PostDatabase.TABLE_POSTS}.likes`,
          `${PostDatabase.TABLE_POSTS}.dislikes`,
          `${PostDatabase.TABLE_POSTS}.comments`,
          `${PostDatabase.TABLE_POSTS}.created_at`,
          `${PostDatabase.TABLE_POSTS}.updated_at`,
          `${UserDatabase.TABLE_USERS}.username as creator_username`
        )
        .join(
          `${UserDatabase.TABLE_USERS}`,
          `${PostDatabase.TABLE_POSTS}.creator_id`,
          "=",
          `${UserDatabase.TABLE_USERS}.id`
        )

      postsDB = result
    }

    return postsDB
  }

  // Método para encontrar um post por ID
  public findPostById = async (id: string): Promise<PostDBWithCreator> => {
    const [result] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.comments`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${PostDatabase.TABLE_POSTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.username as creator_username`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({ [`${PostDatabase.TABLE_POSTS}.id`]: id })

    return result as PostDBWithCreator
  }

  // Método para encontrar o criador de um post por ID
  public findPostCreatorById = async (id: string): Promise<PostDBWithCreator | undefined> => {
    const [result] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${UserDatabase.TABLE_USERS}.username as creator_username`,
        `${PostDatabase.TABLE_POSTS}.content`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      ).where({ creator_id: id })

    return result as PostDBWithCreator | undefined
  }

  // Método para atualizar um post por ID
  public updatePostById = async (idToEdit: string, postDB: PostDB): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .update(postDB)
      .where({ id: idToEdit })
  }

  // Método para deletar um post por ID
  public deletePostById = async (idToDelete: string): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .delete()
      .where({ id: idToDelete })
  }

  // Método para obter o status de like ou dislike de um post
  public likeOrDislikePost = async (id: string): Promise<PostDB | undefined> => {
    const [result] = await BaseDatabase
      .connection(PostDatabase.TABLE_POSTS)
      .select(
        `${PostDatabase.TABLE_POSTS}.id`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        `${PostDatabase.TABLE_POSTS}.content`,
        `${PostDatabase.TABLE_POSTS}.likes`,
        `${PostDatabase.TABLE_POSTS}.dislikes`,
        `${PostDatabase.TABLE_POSTS}.comments`,
        `${PostDatabase.TABLE_POSTS}.created_at`,
        `${PostDatabase.TABLE_POSTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.username as creator_username`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${PostDatabase.TABLE_POSTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      ).where({ [`${PostDatabase.TABLE_POSTS}.id`]: id })

    return result as PostDB | undefined
  }

  // Método para encontrar o status de like ou dislike de um usuário para um post
  public findLikeOrDislike = async (likeOrDislikeDB: LikeOrDislikeDB): Promise<POST_LIKE | undefined> => {
    const [result]: Array<LikeOrDislikeDB | undefined> = await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .select()
      .where({
        user_id: likeOrDislikeDB.user_id,
        post_id: likeOrDislikeDB.post_id
      })

    if (result === undefined) {
      return undefined
    } else if (result.like === 1) {
      return POST_LIKE.ALREADY_LIKED
    } else {
      return POST_LIKE.ALREADY_DISLIKED
    }
  }

  // Método para excluir o status de like ou dislike de um usuário para um post
  public deleteLikeOrDislike = async (likeOrDislikeDB: LikeOrDislikeDB): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .delete()
      .where({
        user_id: likeOrDislikeDB.user_id,
        post_id: likeOrDislikeDB.post_id
      })
  }

  // Método para atualizar o status de like ou dislike de um usuário para um post
  public updateLikeOrDislike = async (likeOrDislikeDB: LikeOrDislikeDB): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .update(likeOrDislikeDB)
      .where({
        user_id: likeOrDislikeDB.user_id,
        post_id: likeOrDislikeDB.post_id
      })
  }

  // Método para inserir o status de like ou dislike de um usuário para um post
  public insertLikeOrDislike = async (likeOrDislikeDB: LikeOrDislikeDB): Promise<void> => {
    await BaseDatabase
      .connection(PostDatabase.TABLE_LIKES_DISLIKES)
      .insert(likeOrDislikeDB)
  }
};