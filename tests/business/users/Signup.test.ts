import { ZodError } from "zod" 
import { UserBusiness } from "../../../src/business/UserBusiness"
import { SignupSchema } from "../../../src/dtos/user/signup.dto" 
import { BadRequestError } from "../../../src/errors/BadRequestError"
import { HashManagerMock } from "../../mocks/hashManager" 
import { IdGeneratorMock } from "../../mocks/IdGenerator" 
import { TokenManagerMock } from "../../mocks/tokenManagerMock" 
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock"


describe('Tests for the Signup method', () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new TokenManagerMock(),
        new IdGeneratorMock(),
        new HashManagerMock()
    );

    test('Should return a mocked token', async () => {
        const input = SignupSchema.parse({
            name: 'RandomUser',
            email: 'randomuser@mail.com',
            password: 'Rand123!'
        });

        const output = await userBusiness.signup(input);

        expect(output).toEqual({
            token: 'token-mock'
        })
    });

    test('Testing "email is already being used" error', async () => {
        expect.assertions(2);
        try {
            const input = SignupSchema.parse({
                name: 'RandomUser',
                email: 'normuser@email.com',
                password: 'Rand123!'
            });

            await userBusiness.signup(input)

        } catch (error) {
            if(error instanceof BadRequestError){
                expect(error.message).toBe('email is already being used.');
                expect(error.statusCode).toBe(400)
            }
        }
    });

    test('Zod validation for the name', async () => {
        expect.assertions(1);
        try {
            const input = SignupSchema.parse({
                name: 'R',
                email: 'randomuser@email.com',
                password: 'Rand123!'
            });

            await userBusiness.signup(input)

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the email', async () => {
        expect.assertions(1);
        try {
            const input = SignupSchema.parse({
                name: 'RandomUser',
                email: 'randomuseremail.com',
                password: 'Rand123!'
            });

            await userBusiness.signup(input)

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    });

    test('Zod validation for the password', async () => {
        expect.assertions(1);
        try {
            const input = SignupSchema.parse({
                name: 'RandomUser',
                email: 'randomuser@mail.com',
                password: 'rand'
            });
    
            await userBusiness.signup(input);

        } catch (error) {
            expect(error instanceof ZodError).toBe(true)
        }
    })
})