import { z } from "zod";

export interface GetUsersInputDTO {
    q?: string;
    token: string;
}

export interface GetUsersOutputDTO {
    id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export const GetUsersSchema = z.object({
    q: z.string({
        invalid_type_error: '"q" must be a string.',
    }).min(1, '"q" must have at least one character.').optional(),
    token: z.string({
        invalid_type_error: 'The "token" must be a string.',
        required_error: 'Please provide a valid "token".',
    }).min(1, 'Invalid token format.')
}).transform(data => data as GetUsersInputDTO);
