export interface CommentDB {
    id: string; // Identificador único do comentário
    post_id: string; // Identificador do post ao qual o comentário está associado
    creator_id: string; // Identificador do usuário que criou o comentário
    content: string; // Conteúdo do comentário
    likes: number; // Número de curtidas do comentário
    dislikes: number; // Número de descurtidas do comentário
    created_at: string; // Data de criação do comentário
    updated_at: string; // Data de atualização do comentário
}

export interface CommentDBWithCreator extends CommentDB {
    creator_username: string; // Nome de usuário do criador do comentário
}

export interface CommentModel {
    id: string; // Identificador único do comentário
    postId: string; // Identificador do post ao qual o comentário está associado
    content: string; // Conteúdo do comentário
    likes: number; // Número de curtidas do comentário
    dislikes: number; // Número de descurtidas do comentário
    createdAt: string; // Data de criação do comentário
    updatedAt: string; // Data de atualização do comentário
    creator: {
        id: string; // Identificador único do criador do comentário
        username: string; // Nome de usuário do criador do comentário
    };
}

export class Comment {
    constructor(
        private id: string, // Identificador único do comentário
        private post_id: string, // Identificador do post ao qual o comentário está associado
        private content: string, // Conteúdo do comentário
        private likes: number, // Número de curtidas do comentário
        private dislikes: number, // Número de descurtidas do comentário
        private createdAt: string, // Data de criação do comentário
        private updatedAt: string, // Data de atualização do comentário
        private creatorId: string, // Identificador do usuário que criou o comentário
        private creatorUsername: string // Nome de usuário do criador do comentário
    ) {}

    // Métodos getters e setters

    public addLike(): void {
        // Adiciona uma curtida ao comentário
        this.likes++;
    }

    public removeLike(): void {
        // Remove uma curtida do comentário, se houver curtidas
        if (this.likes > 0) {
            this.likes--;
        }
    }

    public addDislike(): void {
        // Adiciona uma descurtida ao comentário
        this.dislikes++;
    }

    public removeDislike(): void {
        // Remove uma descurtida do comentário, se houver descurtidas
        if (this.dislikes > 0) {
            this.dislikes--;
        }
    }

    public toDBModel(): CommentDB {
        // Converte o objeto Comment para o formato do banco de dados
        return {
            id: this.id,
            post_id: this.post_id,
            creator_id: this.creatorId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            created_at: this.createdAt,
            updated_at: this.updatedAt,
        };
    }

    public toBusinessModel(): CommentModel {
        // Converte o objeto Comment para o modelo de negócios
        return {
            id: this.id,
            postId: this.post_id,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
            creator: {
                id: this.creatorId,
                username: this.creatorUsername,
            },
        };
    }
};