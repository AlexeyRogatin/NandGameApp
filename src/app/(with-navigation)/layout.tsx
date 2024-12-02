import Link from "next/link"
import { cookies } from "next/headers"

export default function NavigationLayout({children}: {children: React.ReactNode}) {
    const cookieJar = cookies();
    console.log(cookieJar.getAll());
    
    let links: {link: string, str: string}[] = [
        {link: "/levels", str: "Level selection"},
    ]

    
    if (cookieJar.has("user")) {
        links.push({link: "/profile", str: "Profile"});
        let user = JSON.parse(cookieJar.get("user")?.value!);
        switch (user.role) {
            case ("admin"): {
                links.push({link: "/admin", str: "Admin page"});
            } break;
        }
    }

    return (
        <div className="flex flex-1 flex-col justify-between gap-3">
            <div className="flex-0 flex gap-10">
                <Link href="/"><h2>Compute the world</h2></Link>
                <div className="flex-0 flex gap-5">
                    {
                        links.map((link, index) => {
                            return <Link href={link.link} key={index}><h2>{link.str}</h2></Link> 
                        })
                    }
                </div>
            </div>
            
            <div className="flex-1 flex flex-col">
                {children}
            </div>
        </div>
    )
}