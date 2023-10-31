import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {

  public static TABLE_USERS = "users"

  // Método para inserir um novo usuário
  public insertUser = async (input: UserDB): Promise<void> => {
    await BaseDatabase
      .connection(UserDatabase.TABLE_USERS)
      .insert(input)
  }

  // Método para encontrar usuários com uma pesquisa opcional
  public findUsers = async (q: string | undefined): Promise<UserDB[]> => {
    let usersDB;

    if (q) {
      const result: UserDB[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .select()
        .where("username", "LIKE", `%${q}%`)
      
      usersDB = result

    } else {
      const result: UserDB[] = await BaseDatabase
        .connection(UserDatabase.TABLE_USERS)
        .select()
        
      usersDB = result
    }

    return usersDB
  }

  // Método para encontrar um usuário por ID
  public findUserById = async (id: string): Promise<UserDB> => {
    const [userDB]: UserDB[] = await BaseDatabase
      .connection(UserDatabase.TABLE_USERS)
      .select()
      .where({ id })

    return userDB
  }

  // Método para encontrar um usuário por e-mail
  public findUserByEmail = async (email: string): Promise<UserDB> => {
    const [userDB]: UserDB[] = await BaseDatabase
      .connection(UserDatabase.TABLE_USERS)
      .select()
      .where({ email })

    return userDB
  }

  // Método para atualizar um usuário por ID
  public updateUserById = async (id: string, userDB: UserDB): Promise<void> => {
    await BaseDatabase
      .connection(UserDatabase.TABLE_USERS)
      .update(userDB)
      .where({ id })
  }

  // Método para deletar um usuário por ID
  public deleteUserById = async (id: string): Promise<void> => {
    await BaseDatabase
      .connection(UserDatabase.TABLE_USERS)
      .delete()
      .where({ id })
  }
};