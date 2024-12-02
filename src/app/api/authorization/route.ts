
import User from "@/lib/database/entities/User";
import { encodeToken } from "@/lib/encodings/encode";
import { Session, setSessionToCookie } from "@/lib/session/session";
import { NextRequest, NextResponse } from "next/server";

export type AuthorizationData = {
    email: string,
    password: string
}

export async function POST(request: NextRequest) {
    const data = await request.json() as AuthorizationData;
    const { email, password } = data;

    const user = await User.get(email);

    if (!user) {
        return NextResponse.json({ error: 'Incorrect login' }, { status: 500 });
    }

    if (!await user.checkPassword(password)) {
        return NextResponse.json({ error: 'Incorrect password' }, { status: 500 });
    }

    if (!user.veryfied) {
        return NextResponse.json({ error: 'User is not veryfied' }, { status: 500 });
    }

    const session: Session = {
        email: user.email,
        passwordEncoded: await user.passwordEncoded,
    }

    if (!setSessionToCookie(session)) {
        return NextResponse.json({ error: 'Session error. Try again later' }, { status: 500 });
    }

    return NextResponse.json(user, { status: 200 });
}