import { getSessionFromCookie } from "@/lib/session/session";
import User from "@/lib/database/entities/User";

export default async function AdminLayout(
    {children}: {children: React.ReactNode;}
) {
    let error = false;
    
    const session = await getSessionFromCookie();
    
    if (!session) {
        throw new Error("Content is unavailable");
    }

    const user = await User.decodeToken(session);
    if (!user || user.role !== "admin") {
        error = true;
    } 

    return (
        <>
            {children}
        </>
    )
}