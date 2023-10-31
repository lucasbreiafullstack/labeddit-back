import { LikesDislikesDB } from "../models/LikesDislikes"
import { BaseDatabase } from "./BaseDatabase"

export class LikesDislikesDatabase extends BaseDatabase{
    TABLE_NAME = 'likes_dislikes'

    public async getLike(postId:string, userId:string):Promise<LikesDislikesDB[]>{
        const result:LikesDislikesDB[] = await BaseDatabase.connection(this.TABLE_NAME)
            .where({user_id: userId})
            .andWhere({post_id: postId})
        
        return result
    };

    public async createPost(newLikeDislike:LikesDislikesDB):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .insert(newLikeDislike)
    };

    public async editLikes(postId:string, userId:string, like: number):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .update({
                like: like
            })
            .where({user_id: userId})
            .andWhere({post_id: postId})
    };

    public async deletePost(postId:string, userId:string):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .del()
            .where({user_id: userId})
            .andWhere({post_id: postId})
    }
}