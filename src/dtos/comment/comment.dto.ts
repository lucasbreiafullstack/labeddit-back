import { z } from "zod";

export interface CreateCommentInputDTO {
    id: string;
    content: string;
    token: string;
}

export interface CreateCommentOutputDTO {
    comment: string;
}

export const CreateCommentSchema = z.object({
    id: z.string({
        required_error: 'Please provide an "id".',
        invalid_type_error: 'The "id" must be a string.'
    }).min(2, 'Invalid "id", it should have at least 2 characters.'),
    content: z.string({
        required_error: 'Please provide "content".',
        invalid_type_error: 'The "content" must be a string.'
    }).min(1, 'Invalid "content", it must contain at least one character.'),
    token: z.string({
        required_error: 'Please provide a "token".',
        invalid_type_error: 'The "token" must be a string.'
    }).min(2, 'Invalid token format.')
}).transform(data => data as CreateCommentInputDTO);
