import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import { USER_ROLES } from '../models/User'

dotenv.config()

export interface TokenPayload {
    id: string; // Identificador único do usuário
    role: USER_ROLES; // Função ou cargo do usuário (por exemplo, "admin" ou "user")
    username: string; // Nome de usuário do usuário
}

export class TokenManager {
    // Cria um token com base nos dados do payload
    public createToken(payload: TokenPayload): string {
        const token = jwt.sign(
            payload,
            process.env.JWT_KEY as string, // Chave secreta para assinatura do token
            {
                expiresIn: process.env.JWT_EXPIRES_IN as string // Tempo de expiração do token
            }
        )
        return token
    }

    // Obtém o payload (conteúdo) de um token, se válido
    public getPayload(token: string): TokenPayload | null {
        try {
            const payload = jwt.verify(token, process.env.JWT_KEY as string) as TokenPayload
            return payload
        } catch (error) {
            return null // Retorna nulo se o token não for válido
        }
    }
};