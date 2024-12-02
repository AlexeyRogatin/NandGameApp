import { cookies } from "next/headers"
import ExitButton from "./exitButton";
import jwt from "jsonwebtoken";

export default function Profile() {
    const cookieJar = cookies();
    const userToken = cookieJar.get("token")?.value!;
    const user = jwt.verify(userToken, process.env.JWT_SECRET!) as { login: string, role: string };

    return (
        <div>
            <h2>Welcome, {user.login}!</h2>
            <h3>{user.role}</h3>
            <ExitButton/>
        </div>
    )
}