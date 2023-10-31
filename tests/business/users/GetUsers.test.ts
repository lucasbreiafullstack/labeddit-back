import { ZodError } from "zod";
import {UserBusiness} from "../../../src/business/UserBusiness";
import { IdGeneratorMock } from "../../mocks/IdGenerator";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { HashManagerMock } from "../../mocks/hashManager";
import { TokenManagerMock } from "../../mocks/tokenManagerMock";
import { GetUsersSchema } from "../../../src/dtos/user/getUsers.dto";
import { USER_ROLES } from "../../../src/models/User";
import { BadRequestError } from "../../../src/errors/BadRequestError";


describe('Tests for the GetUsers method', () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock(),
        new HashManagerMock()
    );

    test('Should return a list containing all users', async () => {
        const input = GetUsersSchema.parse({
            token: 'token-mock-adminUser'
        });

        const output = await userBusiness.getUsers(input);
        
        expect(output).toHaveLength(3);
        expect(output).toEqual([ 
            {
                id: 'id-mock-normUser',
                name: 'NormUser',
                email: 'normuser@email.com',
                role: USER_ROLES.NORMAL,
                createdAt: expect.any(String)
            },
            {
                id: 'id-mock-adminUser',
                name: 'AdminUser',
                email: 'adminuser@email.com', 
                role: USER_ROLES.ADMIN,
                createdAt: expect.any(String)
            },
            {
                id: 'id-mock-mockUser',
                name: 'MockUser',
                email: 'mockuser@email.com',
                role: USER_ROLES.NORMAL,
                createdAt: expect.any(String)
            }
        ])
    });
    
    test('Should return one user for the query', async () => {
        const input = GetUsersSchema.parse({
            q: 'norm',
            token: 'token-mock-adminUser'
        });

        const output = await userBusiness.getUsers(input);

        expect(output).toEqual([
            {
                id: 'id-mock-normUser',
                name: 'NormUser',
                email: 'normuser@email.com',
                role: USER_ROLES.NORMAL,
                createdAt: expect.any(String)
            }
        ])
    });

    test('Unauthorized user', async () => {
        expect.assertions(2);
        try {
            const input = GetUsersSchema.parse({
                token: 'token-mock-normUser'
            });

            await userBusiness.getUsers(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('Only ADMIN users can access users information.')
            }
        }
    });

    test('Unauthorized token (token without payload)', async () => {
        expect.assertions(2);
        try {
            const input = GetUsersSchema.parse({
                token: 'token-mock'
            });

            await userBusiness.getUsers(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('token is required.')
            }
        }
    });

    test('Zod validation for the token', async () => {
        expect.assertions(1);
        try {
            const input = GetUsersSchema.parse({
                token: 111
            });

            await userBusiness.getUsers(input)

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the query', async () => {
        expect.assertions(1);
        try {
            const input = GetUsersSchema.parse({
                q: 111,
                token: 'token-mock-adminUser'
            });

            await userBusiness.getUsers(input)

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    })
})