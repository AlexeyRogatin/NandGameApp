import Link from "next/link"

export default function EnterLayout(
    {
        children
    } : {
        children: React.ReactNode
    }
) {
    return (
        <div className="flex flex-col gap-4">
            <div className="flex gap-4">
                <Link href="/authorization" className="bordered">Authorization</Link>
                <Link href="/registration" className="bordered">Registration</Link>
            </div>
            {children}
        </div>
    )
}