import { ZodError } from "zod"
import { UserBusiness } from "../../../src/business/UserBusiness"
import { LoginSchema } from "../../../src/dtos/user/login.dto"
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { NotFoundError } from "../../../src/errors/NotFoundError"
import { HashManagerMock } from "../../mocks/hashManager" 
import { IdGeneratorMock } from "../../mocks/IdGenerator" 
import { TokenManagerMock } from "../../mocks/tokenManagerMock" 
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"

describe('Tests for the Login method', () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock(),
        new HashManagerMock()
    );

    test('Should return the mocked token for the normUser', async () => {
        const input = LoginSchema.parse({
            email: 'normuser@email.com',
            password: 'normUser123!'
        });

        const output = await userBusiness.login(input);

        expect(output).toEqual({
            token: 'token-mock-normUser'
        })
    });

    test('Should return the mocked token for the adminUser', async () => {
        const input = LoginSchema.parse({
            email: 'adminuser@email.com',
            password: 'adminUser123!'
        });

        const output = await userBusiness.login(input);

        expect(output).toEqual({
            token: 'token-mock-adminUser'
        })
    });

    test('Test for email not found', async () => {
        expect.assertions(2);
        try {
            const input = LoginSchema.parse({
                email: 'user@email.com',
                password: 'normUser123!'
            });

            await userBusiness.login(input)

        } catch (error) {
            if(error instanceof NotFoundError){
                expect(error.statusCode).toBe(404);
                expect(error.message).toBe('email or password not valid')
            }
        }
    });

    test('Test for wrong password', async () => {
        expect.assertions(2);
        try {
            const input = LoginSchema.parse({
                email: 'normaluser@email.com',
                password: 'normal123!'
            });

            await userBusiness.login(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.statusCode).toBe(400);
                expect(error.message).toBe('email or password not valid')
            }
        }
    });

    test('Zod validation for email', async () => {
        expect.assertions(1);
        try {
            const input = LoginSchema.parse({
                email: 'normaluseremail.com',
                password: 'normalUser123!'
            });

            await userBusiness.login(input)
        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the password', async () => {
        expect.assertions(1);
        try {
            const input = LoginSchema.parse({
                email: 'normaluser@email.com',
                password: ''
            });

            await userBusiness.login(input) 

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    })
})