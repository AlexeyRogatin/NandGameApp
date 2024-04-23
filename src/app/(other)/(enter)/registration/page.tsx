"use client"

import axios from "axios";
import { useRouter } from "next/navigation";
import { useRef } from "react";

export default function Registration() {
    const router = useRouter();

    const login = useRef<HTMLInputElement>(null);
    const pass = useRef<HTMLInputElement>(null);
    
    const registerAction = () => {
        axios.post("/api/registration",{login:login.current?.value, pass: pass.current?.value})
            .then((response) => {
                router.push("/registrationSuccess");
            })
            .catch((error) => {
                console.log(error.response.data.error);
                alert(error.response.data.error);
            });
    }

    return (
        <div className="flex flex-col gap-30">
            <h3>Login</h3>
            <input ref={login} type="text"></input>
            <h3>Password</h3>
            <input ref={pass} type="text"></input>
            <button onClick={registerAction} className="bordered">Register</button>
        </div>
    )
}