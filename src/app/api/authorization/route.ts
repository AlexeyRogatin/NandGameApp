import conn from "@/app/lib/db";
import dbString from "@/app/lib/dbString";
import { makeResponse, makeStatusResponse } from "@/app/lib/response";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    const query = 'SELECT password, role FROM users WHERE login = $1';
    const values = [dbString(body.login)];

    try {
        const result = await conn.query(query, values);
        if (result.rows.length === 0) {
            return makeResponse(500, {error: "Incorrect login"});
        }
        if (result.rows[0].password.toString() !== body.pass.toString()) {
            return makeResponse(500, {error: "Incorrect password"});
        }
        let data = {
            login: body.login,
            role: result.rows[0].role[0],
        }
        let cookieJar = cookies();
        cookieJar.set("user", JSON.stringify(data));
        return makeResponse(200, {role: result.rows[0].role});
    } catch (error) {
        return makeResponse(500, {error: "Network error"});
    }
}