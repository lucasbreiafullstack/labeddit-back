import { z } from "zod";

export interface LikeDislikePostInputDTO {
    id: string;
    like: boolean;
    token: string;
}

export interface LikeDislikePostOutputDTO {}

export const LikeDislikeSchema = z.object({
    id: z.string({
        required_error: 'Please provide a valid "id".',
        invalid_type_error: 'The "id" must be a string.'
    }).min(2, 'Invalid "id", it should have at least 2 characters.'),
    like: z.boolean({
        required_error: 'Please specify "like".',
        invalid_type_error: 'The "like" must be a boolean.'
    }),
    token: z.string({
        required_error: 'Please provide a valid "token".',
        invalid_type_error: 'The "token" must be a string.'
    }).min(2, 'Invalid token format.')
}).transform(data => data as LikeDislikePostInputDTO);
