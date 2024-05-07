import conn from "@/app/lib/db/db";
import dbString from "@/app/lib/db/dbString";
import { makeResponse, makeStatusResponse } from "@/app/lib/db/response";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const query = 'INSERT INTO users(login, password, role) VALUES($1, $2, $3)';
    const values = [dbString(body.login), dbString(body.pass), dbString("user")];

    try {
        const result = await conn.query(query, values);
        return makeStatusResponse(200);
    } catch (error) {
        return makeResponse(500, {error: "Login already exists in the system"});
    }
}