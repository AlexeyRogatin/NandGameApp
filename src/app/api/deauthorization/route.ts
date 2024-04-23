import { makeResponse, makeStatusResponse } from "@/app/lib/response";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const cookieJar = cookies();
        cookieJar.delete("user");
        return makeStatusResponse(200);
    } catch (error) {
        return makeResponse(500, {error: "Error while exiting profile"});
    }
}