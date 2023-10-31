import { z } from "zod"

export interface DeletePostInputDTO{
    id: string,
    token: string
};

export interface DeletePostOutputDTO{};

export const DeletePostSchema = z.object({
    id: z.string(
        {
            required_error: 'id is required.',
            invalid_type_error: 'id must be a string.'
        }
    ).min(2, 'id invalid.'),
    token: z.string(
        {
            required_error: 'token is required.',
            invalid_type_error: 'token must be a string.'
        }
    ).min(2, 'token invalid')
}).transform(data => data as DeletePostInputDTO)