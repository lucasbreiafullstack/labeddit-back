import { ZodError } from "zod"
import { PostBusiness } from "../../../src/business/PostBusiness" 
import { EditPostSchema } from "../../../src/dtos/post/EditPost.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { IdGeneratorMock } from "../../mocks/IdGenerator" 
import { LikesDislikesDatabaseMock } from "../../mocks/LikesDislikesDatabaseMock" 
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { TokenManagerMock } from "../../mocks/tokenManagerMock" 
import { CommentDatabaseMock } from "../../mocks/CommnetDatabaseMock" 

describe('Test for the UpdatePost method', () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new LikesDislikesDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    );

    test('Should return the updated content', async () => {
        const input = EditPostSchema.parse({
            id: 'post001',
            content: 'Updated post',
            token: 'token-mock-normUser'
        });

        const output = await postBusiness.UpdatePost(input)

        expect(output).toEqual({
            content: 'Updated post'
        })
    });

    test('Invalid token error', async () => {
        expect.assertions(2);
        try {
            const input = EditPostSchema.parse({
                id: 'post001',
                content: 'Updated post',
                token: 'token-mock'
            });

            await postBusiness.UpdatePost(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('Invalid token.')
            }
        }
    });

    test('Post not found error', async () => {
        expect.assertions(2);
        try {
            const input = EditPostSchema.parse({
                id: 'post055',
                content: 'Updated post',
                token: 'token-mock-normUser'
            });

            await postBusiness.UpdatePost(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.statusCode).toBe(404);
                expect(error.message).toBe('Post not found.')
            }
        }
    });

    test('Unauthorized user', async () => {
        expect.assertions(2);
        try {
            const input = EditPostSchema.parse({
                id: 'post001',
                content: 'Updated post',
                token: 'token-mock-adminUser'
            });

            await postBusiness.UpdatePost(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('Only the creator of the post can edit it.')
            }
        }
    });

    test('Zod validation for the id', async () => {
        expect.assertions(1);
        try {
            const input = EditPostSchema.parse({
                content: 'Updated post',
                token: 'token-mock-normUser'
            });

            await postBusiness.UpdatePost(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the content', async () => {
        expect.assertions(1);
        try {
            const input = EditPostSchema.parse({
                id: 'post001',
                content: '',
                token: 'token-mock-normUser'
            });

            await postBusiness.UpdatePost(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the token', async () => {
        expect.assertions(1);
        try {
            const input = EditPostSchema.parse({
                id: 'post001',
                content: 'Updated post',
                token: ''
            });

            await postBusiness.UpdatePost(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    })
})