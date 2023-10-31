import { BaseDatabase } from "../../src/database/BaseDatabase";
import { CommentDB } from "../../src/models/Comment";

const commentsMock: CommentDB[] = [
    {
        id: 'comment001',
        creator_id: 'id-mock-normUser',
        post_id: 'post002',
        content: 'first comment',
        likes: 2,
        dislikes: 1,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'comment002',
        creator_id: 'id-mock-adminUser',
        post_id: 'post002',
        content: 'second comment',
        likes: 0,
        dislikes: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    },
    {
        id: 'comment003',
        creator_id: 'id-mock-adminUser',
        post_id: 'post001',
        content: 'third comment',
        likes: 0,
        dislikes: 4,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
    }
]

export class CommentDatabaseMock extends BaseDatabase{
    public TABLE_NAME = 'comments'

    public async createComment(newComment:CommentDB):Promise<void>{
    
    }
}