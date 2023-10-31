export enum USER_ROLES{
    NORMAL = 'NORMAL',
    ADMIN = 'ADMIN'
};

export class User{
    constructor(
        private id: string,
        private name: string,
        private email: string,
        private password: string,
        private role: USER_ROLES,
        private createdAT: string
    ){};

    public getId():string{
        return this.id
    };
    public getName():string{
        return this.name
    };
    public getEmail():string{
        return this.email
    };
    public getPassword():string{
        return this.password
    };
    public getRole():USER_ROLES{
        return this.role
    };
    public getCreatedAt():string{
        return this.createdAT
    };
    public setName(name:string):void{
        this.name = name
    };
    public setEmail(email:string):void{
        this.email = email
    };
    public setPassword(password:string):void{
        this.password = password
    };
    public setRole(role:USER_ROLES):void{
        this.role = role
    };

    public userToDBModel():UserDB{
        return{
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            user_role: this.role,
            created_at: this.createdAT
        }
    }
}

export interface UserDB{
    id: string,
    name: string,
    email: string,
    password: string,
    user_role: USER_ROLES,
    created_at: string
};

export interface TokenPayload {
    id: string,
    role: USER_ROLES,
    name: string
};