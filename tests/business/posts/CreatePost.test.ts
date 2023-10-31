import { ZodError } from "zod";
import { PostBusiness } from "../../../src/business/PostBusiness";
import { CreatePostSchema } from "../../../src/dtos/post/CreatePost.dto"; 
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { IdGeneratorMock } from "../../mocks/IdGenerator"; 
import { LikesDislikesDatabaseMock } from "../../mocks/LikesDislikesDatabaseMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { TokenManagerMock } from "../../mocks/tokenManagerMock"; 
import { CommentDatabaseMock } from "../../mocks/CommnetDatabaseMock"; 

describe('Tests for the CreatePost method', () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new LikesDislikesDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    );

    test('Should return the content of the new post', async () => {
        const input = CreatePostSchema.parse({
            content: 'Create post test',
            token: 'token-mock-adminUser'
        });

        const output = await postBusiness.createPost(input);

        expect(output).toEqual({
            content: 'Create post test'
        })
    });

    test('Invalid token', async () => {
        expect.assertions(2);
        try {
            const input = CreatePostSchema.parse({
                content: 'Create post test',
                token: 'token-mock'
            });

            await postBusiness.createPost(input);

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('Invalid token.')
            }
        }
    });

    test('Zod validation for the content', async () => {
        expect.assertions(1);
        try {
            const input = CreatePostSchema.parse({
                content: '',
                token: 'token-mock-normUser'
            });

            await postBusiness.createPost(input)

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the token', async () => {
        expect.assertions(1);
        try {
            const input = CreatePostSchema.parse({
                content: 'Create post test',
                token: 111
            });

            await postBusiness.createPost(input) 
            
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    })
})