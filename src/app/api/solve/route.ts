import { Scheme } from "@/lib/schemeworks/Components";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    const body = await request.json();
    try {
        let scheme = Scheme.unpack(body);
        let failedTests = scheme.getFailedTests();
        let componentCount = scheme.getComponentCount();
        let nandCount = scheme.getNandCount();

        let data = {
            success: failedTests.length === 0,
            failedTests: failedTests,
            componentCount: componentCount,
            nandCount: nandCount
        };

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        return NextResponse.json({ error: "Error while checking solution" }, { status: 500 });
    }
}