"use client"

import axios from "axios";
import SubmitForm, { FormParam } from "@/components/SubmitForm";
import { useRouter } from "next/navigation";
import { AuthorizationData } from "@/app/api/authorization/route";

const formParams: FormParam[] = [
    {
        name: "email",
        title: "Email",
        inputType: "text",
        defValue: ""
    },
    {
        name: "password",
        title: "Password",
        inputType: "password",
        defValue: ""
    },
]

export default function Authorization() {
    const router = useRouter();
    
    const handleAuthorization = (data: AuthorizationData) => {
        axios.post("/api/authorization", data)
            .then(
                (response) => {
                    const user = response.data;
                    switch (user.role) {
                        case "admin": {
                            router.push("/admin");
                        } break;
                        case "user": {
                            router.push("/levels");
                        } break;
                    }
                }
            )
            .catch((error) => {
                alert(error.response.data.error);
            });
    }
    
    return (
        <div className="flex flex-col gap-8">
            <SubmitForm params={formParams} submit={ handleAuthorization as (data: any) => {} } />
        </div>
    )
}