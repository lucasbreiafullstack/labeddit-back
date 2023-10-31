import { BaseDatabase } from "../../src/database/BaseDatabase";
import { LikesDislikesCountDB } from "../../src/models/LikesDislikes";
import { GetPostDB, PostDB } from "../../src/models/Post";

export class PostDatabaseMock extends BaseDatabase {
    TABLE_NAME = 'posts'

    public async createPost(newPost:PostDB):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .insert(newPost)
    };

    public async getPosts():Promise<GetPostDB[]>{
        const result:GetPostDB[] = await BaseDatabase.connection(this.TABLE_NAME)
            .select(
                'posts.id',
                'posts.content',
                'posts.likes',
                'posts.dislikes',
                'posts.comments',
                'posts.created_at as createdAt',
                'posts.updated_at as updatedAt',
                'posts.creator_id as creatorId',
                'users.name as creatorName'
            )
            .innerJoin('users', 'users.id', '=', 'posts.creator_id');
        
        return result
    };

    public async getPostById(id:string):Promise<PostDB>{
        const [postDB]:PostDB[] = await super.findById(id);
        
        return postDB
    };

    public async updatePost(editedPost:PostDB):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .update(editedPost)
            .where({id: editedPost.id})
            .andWhere({creator_id: editedPost.creator_id});
    };

    public async deletePost(id:string):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .del()
            .where({id})
    };

    public async editPostLikes(postId:string, newLikeDislikeCount:LikesDislikesCountDB):Promise<void>{
        await BaseDatabase.connection(this.TABLE_NAME)
            .update(
                {
                    likes: newLikeDislikeCount.newLikeCount,
                    dislikes: newLikeDislikeCount.newDislikeCount
                }
            ).where({id: postId})
    }
}