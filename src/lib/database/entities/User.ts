import { decodeToken, encodeToken } from "@/lib/encodings/encode";
import { Delete, InsertOne, Select, SelectOne, Update } from "../connection/db";


export type UserToken = {
    email: string,
    passwordEncoded: string
}

export default class User {
    email: string = "";
    passwordEncoded: Promise<string> = new Promise((resolve) => resolve(""));
    username: string = "";
    role: string = "";
    veryfied: boolean = false;

    set password(val: string) {
        const recentPasswordEncoded = this.passwordEncoded
        this.passwordEncoded = new Promise((resolve) => {
            encodeToken(val)
                .then((val) => {
                    if (val) {
                        resolve(val);
                    } else {
                        recentPasswordEncoded
                            .then((val) => {
                                resolve(val);
                            });
                    }
                })
        });
    }

    async add() {
        const userObject = {
            email: this.email,
            password: await this.passwordEncoded,
            username: this.username,
            role: this.role,
            verified: this.veryfied
        }
        return await InsertOne("users", userObject);
    }

    static async get(email: string) {
        const user = new User;
        const res = await SelectOne("users", [{param: "email", value: email}]);
        if (!res) {
            return null;
        } 
        user.email = res.email;
        user.passwordEncoded = res.password;
        user.username = res.username;
        user.role = res.role;
        user.veryfied = res.verified;
        return user;
    }

    static async getAll() {
        const results = await Select("users", []);
        const users: User[] = [];
        for (const res of results) {
            const user = new User;
            user.email = res.email;
            user.passwordEncoded = res.password;
            user.username = res.username;
            user.role = res.role;
            user.veryfied = res.verified;
            users.push(user);
        }
        return users;
    }

    async set(email: string) {
        return await Update("users", [{param: "email", value: email}], [
            { param: "email", value: this.email },
            { param: "password", value: this.passwordEncoded },
            { param: "username", value: this.username },
            { param: "role", value: this.role },
            { param: "verified", value: this.veryfied },
        ])
    }

    static async delete(email: string) {
        return await Delete("users", [{param: "email", value: email}])
    }

    static async decodeToken(token: UserToken) {
        const user = await User.get(token.email);
        if (!user || await decodeToken(token.passwordEncoded) !== await decodeToken(await user.passwordEncoded)) {
            return null;
        }
        return user;
    }

    async encode() {
        const tokenData: UserToken = {
            email: this.email,
            passwordEncoded: await this.passwordEncoded
        }
        return await encodeToken(tokenData);
    }

    static async decode(token: string) {
        const tokenData = await decodeToken(token);
        if (!tokenData) {
            return null;
        }
        const tokenUserData = tokenData as UserToken;
        return await User.decodeToken(tokenUserData);
    }

    async checkPassword(password: string) {
        const pass = await decodeToken(await this.passwordEncoded);
        return password === pass;
    }
}