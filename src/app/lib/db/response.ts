export function makeResponse(status: number, data: Object) {
    return new Response(JSON.stringify(data), { status: status, headers: {'Content-Type': 'application/json'} });
}

export function makeStatusResponse(status: number) {
    return new Response("", { status: status });
}