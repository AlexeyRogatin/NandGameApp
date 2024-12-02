import { cookies } from "next/headers";
import { decodeToken, encodeToken } from "../encodings/encode";
import { UserToken } from "../database/entities/User";

export type Session = UserToken;

export async function getSessionFromCookie(encoded: boolean = false, cookieName: string = "token") {
    const cookieJar = cookies();
    const token = cookieJar.get(cookieName);

    if (!token) {
        return null;
    }

    if (encoded) {
        return await decodeToken(token.value) as Session;
    } else {
        return JSON.parse(token.value);
    }
}

export async function setSessionToCookie(session: Session, encoded: boolean = false, cookieName: string = "token") {
    const cookieJar = cookies();

    if (encoded) {
        const token = await encodeToken(session);

        if (!token) {
            return false;
        }
    
        cookieJar.set(cookieName, token);
    } else {
        cookieJar.set(cookieName, JSON.stringify(session));
    }

    return true;
}