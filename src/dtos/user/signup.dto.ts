import { z } from "zod";

export interface SignupInputDTO {
    name: string;
    email: string;
    password: string;
}

export interface SignupOutputDTO {
    token: string;
}

export const SignupSchema = z.object({
    name: z.string({
        required_error: 'Please provide your name.',
        invalid_type_error: 'The name must be a string.'
    }).min(2, 'Name must have at least 2 characters.'),
    email: z.string({
        required_error: 'Please provide an email.',
        invalid_type_error: 'The email must be a string.'
    
    }).refine(
        (value) => /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/g.test(value),
        'Invalid email format'
    ),
    password: z.string({
        required_error: 'Please provide a password.',
        invalid_type_error: 'The password must be a string.',
    
    }).refine(
        (value) => /^(?=.*[A-Z])(?=.*[!#@$%&])(?=.*[0-9])(?=.*[a-z]).{6,10}$/g.test(value),
        'Invalid password. It must have 6 to 10 characters, with uppercase, lowercase letters, a special character, and a number.'
    )
}).transform(data => data as SignupInputDTO);
