import jwt from "jsonwebtoken";
import { checkEnvVar } from "../errors/environmentErrors";

export async function encodeToken(data: any) {
    checkEnvVar("JWT_SECRET", "Please specify environmental variable");

    let token = await new Promise((resolve, reject) => {
        jwt.sign(data, process.env.JWT_SECRET!, (error: any, encoded: any) => {
            resolve(encoded);
        });
    });

    if (!token) {
        return null;
    }

    return token as string;
}

export async function decodeToken(token: string) {
    checkEnvVar("JWT_SECRET", "Please specify environmental variable");

    const obj: string | jwt.JwtPayload | undefined = await new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET!, (error, decoded) => {
            resolve(decoded);
        });
    });

    if (!obj) {
        return null;
    }

    const objData = obj as Object;
    return objData;
}