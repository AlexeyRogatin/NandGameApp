import { cookies } from "next/headers";
import Link from "next/link";

export default function AdminLayout(
    {children}: {children: React.ReactNode;}
) {
    let cookieJar = cookies();
    if (!cookieJar.has("user")) {
        return (
            <div className="flex w-full h-full justify-around content-center flex-wrap">
                <div className="flex flex-col flex-wrap content-center gap-50">
                    <h2>Contents are unavailable</h2>
                    <p>Sorry, but this content is available only to authorized users</p>
                    <Link href="/authorization" className="bordered">Go to authorization</Link>
                </div>
            </div>
        )
    } else {
        return (
            <>
                {children}
            </>
        )
    }
}