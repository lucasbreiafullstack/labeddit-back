export class Comment{
    constructor(
        private id: string,
        private creatorId: string,
        private postId: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private createdAt: string,
        private updatedAt: string
    ){};

    public getId():string{
        return this.id
    };
    public getCreatorId():string{
        return this.creatorId
    };
    public getPostId():string{
        return this.postId
    };
    public getContent():string{
        return this.content
    };
    public getLikes():number{
        return this.likes
    };
    public getDislikes():number{
        return this.dislikes
    };
    public getCreatedAt():string{
        return this.createdAt
    };
    public getUpdatedAt():string{
        return this.updatedAt
    };
    public setContent(content:string):void{
        this.content = content
    };
    public setLikes(likes:number):void{
        this.likes = likes
    };
    public setDislikes(dislikes:number):void{
        this.dislikes = dislikes
    };
    public setUpdatedAt(updatedAt:string):void{
        this.updatedAt = updatedAt
    };

    public commentToDBModel():CommentDB{
        return{
            id: this.id,
            creator_id: this.creatorId,
            post_id: this.postId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        }
    }
};



export interface CommentDB{
    id: string,
    creator_id: string,
    post_id: string,
    content: string,
    likes: number,
    dislikes: number,
    created_at: string,
    updated_at: string
}