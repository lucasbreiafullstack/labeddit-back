import { ZodError } from "zod"
import {PostBusiness} from "../../../src/business/PostBusiness"
import { CreateCommentSchema } from "../../../src/dtos/comment/comment.dto";
import { BadRequestError } from "../../../src/errors/BadRequestError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { LikesDislikesDatabaseMock } from "../../mocks/LikesDislikesDatabaseMock";
import { CommentDatabaseMock } from "../../mocks/CommnetDatabaseMock";
import { TokenManagerMock } from "../../mocks/tokenManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGenerator";

describe('Tests for the CreateComment method', () => {
    const postBusiness = new PostBusiness(
        new PostDatabaseMock(),
        new LikesDislikesDatabaseMock(),
        new CommentDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock()
    );

    test('Should return the content of the comment', async () => {
        const input = CreateCommentSchema.parse({
            id: 'post002',
            content: 'second comment',
            token: 'token-mock-adminUser'
        });

        const output = await postBusiness.createComment(input);

        expect(output).toEqual({
            comment: 'second comment'
        })
    });

    test('Invalid token', async () => {
        expect.assertions(2);
        try {
            const input = CreateCommentSchema.parse({
                id: 'post002',
                content: 'second comment',
                token: 'token-mock'
            });

            await postBusiness.createComment(input)
        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe('Invalid token.');
                expect(error.statusCode).toBe(400)
            }
        }
    });

    test('Post not found', async () => {
        expect.assertions(2);
        try {
            const input = CreateCommentSchema.parse({
                id: 'post055',
                content: 'second comment',
                token: 'token-mock-normUser'
            });

            await postBusiness.createComment(input)
        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.message).toBe('Post not found.');
                expect(error.statusCode).toBe(404)
            }
        }
    });

    test('Zod validation for the id', async () => {
        expect.assertions(1);
        try {
            const input = CreateCommentSchema.parse({
                id: 111,
                content: 'second comment',
                token: 'token-mock-normUser'
            });

            await postBusiness.createComment(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the content', async () => {
        expect.assertions(1);
        try {
            const input = CreateCommentSchema.parse({
                id: 'post002',
                content: '',
                token: 'token-mock-normUser'
            });

            await postBusiness.createComment(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the token', async () => {
        expect.assertions(1);
        try {
            const input = CreateCommentSchema.parse({
                id: 'post002',
                content: 'second comment',
                token: ''
            });
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    })
})