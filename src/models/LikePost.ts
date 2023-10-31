export interface LikeOrDislikeDB {
    user_id: string; // Identificador único do usuário que realizou a ação de curtir/descurtir
    post_id: string; // Identificador único do post curtido/descurtido
    like: number; // Valor numérico que representa a ação (1 para curtir, -1 para descurtir)
}

export interface LikeOrDislikeModel {
    user_id: string; // Identificador único do usuário que realizou a ação de curtir/descurtir
    post_id: string; // Identificador único do post curtido/descurtido
    like: number; // Valor numérico que representa a ação (1 para curtir, -1 para descurtir)
}

export enum POST_LIKE {
    ALREADY_LIKED = "ALREADY LIKED", // Enumeração para indicar que o post já foi curtido pelo usuário
    ALREADY_DISLIKED = "ALREADY DISLIKED" // Enumeração para indicar que o post já foi descurtido pelo usuário
}

export class LikeOrDislike {
    constructor(
        private userId: string, // Identificador único do usuário que realizou a ação de curtir/descurtir
        private postId: string, // Identificador único do post curtido/descurtido
        private like: number // Valor numérico que representa a ação (1 para curtir, -1 para descurtir)
    ) {}

    public getUserId(): string {
        return this.userId;
    }

    public setUserId(value: string): void {
        this.userId = value;
    }

    public getPostId(): string {
        return this.postId;
    }

    public setPostId(value: string): void {
        this.postId = value;
    }

    public getLike(): number {
        return this.like;
    }

    public setLike(value: number): void {
        this.like = value;
    }

    public toDBModel(): LikeOrDislikeDB {
        return {
            user_id: this.userId,
            post_id: this.postId,
            like: this.like
        };
    }

    public toBusinessModel(): LikeOrDislikeModel {
        return {
            user_id: this.userId,
            post_id: this.postId,
            like: this.like
        };
    }
};