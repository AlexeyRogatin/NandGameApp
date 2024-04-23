"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Authorization() {
    const login = useRef<HTMLInputElement>(null);
    const pass = useRef<HTMLInputElement>(null);

    const router = useRouter();
    
    const registerAction = () => {
        axios.post("/api/authorization",{login:login.current?.value, pass: pass.current?.value})
            .then((response) => {
                let role = response.data.role.toString();
                switch (role) {
                    case "admin": {
                        router.push("/admin");
                    } break;
                    case "user": {
                        router.push("/levels");
                    } break;
                }
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    }
    
    return (
        <div className="flex flex-col gap-30">
            <h3>Login</h3>
            <input ref={login} type="text"></input>
            <h3>Password</h3>
            <input ref={pass} type="text"></input>
            <button onClick={registerAction} className="bordered">Authorize</button>
        </div>
    )
}