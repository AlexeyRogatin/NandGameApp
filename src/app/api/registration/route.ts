import User from "@/lib/database/entities/User";
import { sendEmail } from "@/lib/email/email";
import Verification from "@/lib/email/templates/Verification";
import { NextRequest, NextResponse } from "next/server";

export type RegistrationData = {
    username: string,
    email: string,
    password: string,
}

export async function POST(request: NextRequest) {
    const data = await request.json() as RegistrationData;

    const { username, email, password } = data;

    const checkUser = await User.get(email);

    if (checkUser) {
        return NextResponse.json({ error: "User with this email already existst in the system" }, { status: 500 });
    }

    const user = new User();
    user.email = email;
    user.password = password;
    user.username = username;
    user.role = "user";
    user.veryfied = false;
    
    if (!user.add()) {
        return NextResponse.json({ error: "Registration has encountered an error" }, { status: 500 });
    }

    const token = await user.encode();

    if (!token) {
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    sendEmail(email, "Verification", Verification({ baseUrl: request.headers.get("Host")!, token }));

    return NextResponse.json({ }, { status: 200 });
}