export class Post{
    constructor(
        private id: string,
        private creatorId: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private comments: number,
        private createdAt: string,
        private updatedAt: string
    ){};

    public getId():string{
        return this.id
    };
    public getCreatorId():string{
        return this.creatorId
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
    public getComments():number{
        return this.comments
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
    public setComments(comments:number):void{
        this.comments = comments
    };
    public setUpdateAt(updatedAt:string):void{
        this.updatedAt = updatedAt
    };

    public postToDBModel():PostDB{
        return{
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            comments: this.comments,
            created_at: this.createdAt,
            updated_at: this.updatedAt
        }
    }
};

export interface PostDB{
    id: string,
    creator_id: string,
    content: string,
    likes: number,
    dislikes: number,
    comments: number,
    created_at: string,
    updated_at:string
};

export interface GetPostDB{
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    comments: number,
    createdAt: string,
    updatedAt: string,
    creatorId: string,
    creatorName: string
}