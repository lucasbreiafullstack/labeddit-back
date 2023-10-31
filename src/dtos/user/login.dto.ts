import { z } from "zod"

export interface LoginInputDTO{
    email: string,
    password: string
};

export interface LoginOutputDTO{
    token: string
};

export const LoginSchema = z.object({
    email: z.string(
        {
            required_error: 'email is required.',
            invalid_type_error: 'email must be a string'
        }
    ).refine(
        (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value),
        'email not valid'
    ),
    password: z.string(
        {
            required_error: 'password is required.',
            invalid_type_error: 'password must be a string'
        }
    ).min(2)
}).transform(data => data as LoginInputDTO)