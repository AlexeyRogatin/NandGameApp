import Link from "next/link";

export default function SharedLayout(
    {children}: {children: React.ReactNode;}
) {
    return (
        <div className="w-full h-full flex flex-col flex-0">
            <Link href="/"><h2>Compute the world</h2></Link>
            <div className="flex-1">
                {children}
            </div>
        </div>
    )
}