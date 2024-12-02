"use client"

import Link from "next/link";

export default function RegistrationError(
    {
        error, reset
    } : {
        error: Error, reset: () => {}
    }) {
    return (
        <div className="flex w-full h-full justify-around content-center flex-wrap">
            <div className="flex flex-col flex-wrap content-center gap-50">
                <h2>Your registration has encountered an error</h2>
                <button onClick={reset} className="bordered text-left">Try again</button>
                <Link href="/authorization" className="bordered">Go to authorization</Link>
            </div>
        </div>
    )
}