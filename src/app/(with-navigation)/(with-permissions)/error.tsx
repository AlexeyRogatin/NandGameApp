"use client"

import Link from "next/link";

export default function PermissionError() {
    return (
        <div className="flex w-full h-full justify-around content-center flex-wrap">
            <div className="flex flex-col flex-wrap content-center gap-50">
                <h2>Contents are unavailable</h2>
                <p>Sorry, but this content is not available with your current permissions</p>
                <Link href="/authorization" className="bordered">Go to authorization</Link>
            </div>
        </div>
    )
}