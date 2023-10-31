import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";


export class UserDatabase extends BaseDatabase {
    TABLE_NAME = 'users'

    public async findUsers(q:string|undefined):Promise<UserDB[]>{
        let usersDB;

        if(q){
            const result: UserDB[] = await BaseDatabase.connection(this.TABLE_NAME)
                .where('name', 'LIKE', `%${q}%`);
            
            usersDB = result
        }else{
            const result: UserDB[] = await super.findAll();

            usersDB = result
        };

        return usersDB
    };

    public async findEmail(email:string):Promise<UserDB>{
        const [result]:UserDB[] = await BaseDatabase.connection(this.TABLE_NAME)
            .where({email});
        
        return result
    };

    public async createUser(newUser:UserDB):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .insert(newUser)
    };
}