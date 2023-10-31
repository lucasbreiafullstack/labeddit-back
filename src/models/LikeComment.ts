export interface LikeOrDislikeDB {
    user_id: string; // Identificador único do usuário que realizou a ação de curtir/descurtir
    comment_id: string; // Identificador único do comentário curtido/descurtido
    like: number; // Valor numérico que representa a ação (1 para curtir, -1 para descurtir)
}

export interface LikeOrDislikeModel {
    user_id: string; // Identificador único do usuário que realizou a ação de curtir/descurtir
    comment_id: string; // Identificador único do comentário curtido/descurtido
    like: number; // Valor numérico que representa a ação (1 para curtir, -1 para descurtir)
}

export enum COMMENT_LIKE {
    ALREADY_LIKED = "ALREADY LIKED", // Enumeração para indicar que o comentário já foi curtido pelo usuário
    ALREADY_DISLIKED = "ALREADY DISLIKED" // Enumeração para indicar que o comentário já foi descurtido pelo usuário
}

export class LikeOrDislike {
    constructor(
        private userId: string, // Identificador único do usuário que realizou a ação de curtir/descurtir
        private commentId: string, // Identificador único do comentário curtido/descurtido
        private like: number // Valor numérico que representa a ação (1 para curtir, -1 para descurtir)
    ) {}

    public getUserId(): string {
        return this.userId;
    }

    public setUserId(value: string): void {
        this.userId = value;
    }

    public getCommentId(): string {
        return this.commentId;
    }

    public setCommentId(value: string): void {
        this.commentId = value;
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
            comment_id: this.commentId,
            like: this.like
        };
    }

    public toBusinessModel(): LikeOrDislikeModel {
        return {
            user_id: this.userId,
            comment_id: this.commentId,
            like: this.like
        };
    }
};