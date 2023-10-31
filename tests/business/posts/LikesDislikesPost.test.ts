import { ZodError } from "zod"
import { PostBusiness } from "../../../src/business/PostBusiness" 
import { LikeDislikeSchema } from "../../../src/dtos/post/likeDislikePost.dto" 
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { IdGeneratorMock } from "../../mocks/IdGenerator" 
import { LikesDislikesDatabaseMock } from "../../mocks/LikesDislikesDatabaseMock" 
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock"
import { TokenManagerMock } from "../../mocks/tokenManagerMock" 
import { CommentDatabaseMock } from "../../mocks/CommnetDatabaseMock" 

describe('Tests for the LikeDislikePost method', () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new LikesDislikesDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    );

    test('Should not throw any errors when executed (liking a post already liked)', async () => {
        const input = LikeDislikeSchema.parse({
            id: 'post001',
            like: true,
            token: 'token-mock-adminUser'
        });

        await postBusiness.likeDislikePost(input);

        expect(async () => await postBusiness.likeDislikePost(input)).not.toThrow()
    });

    test('Should not throw any errors when executed (disliking a post already liked)', async () => {
        const input = LikeDislikeSchema.parse({
            id: 'post001',
            like: false,
            token: 'token-mock-adminUser'
        });

        await postBusiness.likeDislikePost(input);

        expect(async () => await postBusiness.likeDislikePost(input)).not.toThrow()
    });

    test('Should not throw any errors when executed (liking a new post)', async () => {
        const input = LikeDislikeSchema.parse({
            id: 'post001',
            like: true,
            token: 'token-mock-mockUser'
        });

        await postBusiness.likeDislikePost(input);

        expect(async () => await postBusiness.likeDislikePost(input)).not.toThrow()
    });

    test('Should not throw any errors when executed (disliking a new post)', async () => {
        const input = LikeDislikeSchema.parse({
            id: 'post003',
            like: false,
            token: 'token-mock-mockUser'
        });

        await postBusiness.likeDislikePost(input);

        expect(async () => await postBusiness.likeDislikePost(input)).not.toThrow()
    });

    test('Should not throw any errors when executed (liking a post already disliked)', async () => {
        const input = LikeDislikeSchema.parse({
            id: 'post003',
            like: true,
            token: 'token-mock-normUser'
        });

        await postBusiness.likeDislikePost(input);

        expect(async () => await postBusiness.likeDislikePost(input)).not.toThrow()
    });

    test('Should not throw any errors when executed (disliking a post already disliked)', async () => {
        const input = LikeDislikeSchema.parse({
            id: 'post003',
            like: false,
            token: 'token-mock-normUser'
        });

        await postBusiness.likeDislikePost(input);

        expect(async () => await postBusiness.likeDislikePost(input)).not.toThrow()
    });

    test('Invalid token', async () => {
        expect.assertions(2);
        try {
            const input = LikeDislikeSchema.parse({
                id: 'post001',
                like: true,
                token: 'token-mock'
            });

            await postBusiness.likeDislikePost(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('Invalid token.')
            }
        }
    });

    test('Post not found', async () => {
        expect.assertions(2);
        try {
            const input = LikeDislikeSchema.parse({
                id: 'post055',
                like: true,
                token: 'token-mock-adminUser'
            });

            await postBusiness.likeDislikePost(input)

        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.statusCode).toBe(404);
                expect(error.message).toBe('Post not found.')
            }
        }
    });

    test('Zod validation for the id', async () => {
        expect.assertions(1);
        try {
            const input = LikeDislikeSchema.parse({
                id: ' ',
                like: true,
                token: 'token-mock-adminUser'
            });
    
            await postBusiness.deletePost(input)

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the like', async () => {
        expect.assertions(1);
        try {
            const input = LikeDislikeSchema.parse({
                id: 'post001',
                like: 'true',
                token: 'token-mock-adminUser'
            });
    
            await postBusiness.deletePost(input)

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the token', async () => {
        expect.assertions(1);
        try {
            const input = LikeDislikeSchema.parse({
                id: 'post001',
                like: true,
                token: ''
            });
    
            await postBusiness.deletePost(input)

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    })
})