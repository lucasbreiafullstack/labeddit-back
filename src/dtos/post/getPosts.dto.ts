import { z } from "zod";

export interface GetPostsInputDTO {
    token: string;
}

export interface GetPostsOutputDTO {
    id: string;
    content: string;
    likes: number;
    dislikes: number;
    createdAt: string;
    updatedAt: string;
    creator: {
        id: string;
        name: string;
    };
}

export const GetPostSchema = z.object({
    token: z.string({
        required_error: 'Please provide a valid "token".',
        invalid_type_error: 'The "token" must be a string.'
    }).min(2, 'Invalid token format.')
}).transform(data => data as GetPostsInputDTO);
