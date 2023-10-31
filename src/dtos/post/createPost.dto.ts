import { z } from "zod";

export interface CreatePostInputDTO {
    content: string;
    token: string;
}

export interface CreatePostOutputDTO {
    content: string;
}

export const CreatePostSchema = z.object({
    content: z.string({
        required_error: 'Please provide "content".',
        invalid_type_error: 'The "content" must be a string.'
    }).min(1, 'Invalid "content", it must contain at least one character.'),
    token: z.string({
        required_error: 'Please provide a "token".',
        invalid_type_error: 'The "token" must be a string.'
    }).min(2, 'Invalid token format.')
}).transform(data => data as CreatePostInputDTO);
