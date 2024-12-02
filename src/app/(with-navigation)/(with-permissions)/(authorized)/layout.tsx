import { cookies } from "next/headers";
import Link from "next/link";
import jwt from "jsonwebtoken";
import { getSessionFromCookie } from "@/lib/session/session";
import User from "@/lib/database/entities/User";

export default async function AuthorizedLayout(
    {children}: {children: React.ReactNode;}
) {
    let error = false;
    
    const session = await getSessionFromCookie();
    console.log(session);
    if (!session) {
        throw new Error("Content is unavailable");
    }

    const user = await User.decodeToken(session);
    if (!user || user.role !== "admin") {
        error = true;
    } 

    return (
        <>
            {children}
        </>
    )
}