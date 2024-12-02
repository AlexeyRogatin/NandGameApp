import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const cookieJar = cookies();
        cookieJar.delete("user");
        
        return NextResponse.json({}, {status: 200});
    } catch (error) {
        return NextResponse.json({ error: "Error while exiting profile" }, {status: 500});
    }
}