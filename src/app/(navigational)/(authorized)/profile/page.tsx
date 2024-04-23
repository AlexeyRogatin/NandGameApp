import { cookies } from "next/headers"
import ExitButton from "./exitButton";

export default function Profile() {
    const cookieJar = cookies();
    let user = JSON.parse(cookieJar.get("user")?.value!);

    return (
        <div>
            <h2>Welcome, {user.login}!</h2>
            <h3>{user.role}</h3>
            <ExitButton/>
        </div>
    )
}