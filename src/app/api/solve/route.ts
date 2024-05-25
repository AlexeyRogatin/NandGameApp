import { ComponentGetter, ComponentNode, Scheme, SchemeLink } from "@/app/lib/scheme/Components";
import { EasyLink } from "@/app/(navigational)/level/LevelCanvas";
import conn from "@/app/lib/db/db";
import dbString from "@/app/lib/db/dbString";
import { makeResponse, makeStatusResponse } from "@/app/lib/db/response";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    try {
        let scheme = Scheme.unpack(body);
        let failedTests = scheme.getFailedTests();
        let componentCount = scheme.getComponentCount();
        let nandCount = scheme.getNandCount();

        return makeResponse(200, {success: failedTests.length === 0, failedTests: failedTests,
            componentCount: componentCount, nandCount: nandCount});
    } catch (error) {
        return makeResponse(500, {error: "Error while checking solution"});
    }
}