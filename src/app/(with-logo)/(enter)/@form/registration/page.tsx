"use client"

import axios from "axios";
import SubmitForm, { FormParam } from "@/components/SubmitForm";
import { useRouter } from "next/navigation";
import { RegistrationData } from "@/app/api/registration/route";

const formParams: FormParam[] = [
    {
        name: "username",
        title: "Username",
        inputType: "text",
        defValue: ""
    },
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
    {
        name: "checkPassword",
        title: "Confirm password",
        inputType: "password",
        defValue: ""
    },
]

export default function Registration() {
    const router = useRouter();
    
    const handleRegistration = (data: RegistrationData & {checkPassword: string}) => {
        const {email, password, checkPassword, username} = data;

        if (password === checkPassword) {
            const data: RegistrationData = { email, password, username };
            axios.post("/api/registration", data)
                .then((response) => {
                    router.push("/mailVeryfication");
                })
                .catch((error) => {
                    console.log(error.response.data.error);
                    alert(error.response.data.error);
                });
        } else {
            alert("Passwords are not identical");
        }
    }
    
    return (
        <div className="flex flex-col gap-8">
            <SubmitForm params={formParams} submit={handleRegistration as (data: any) => {}} />
        </div>
    )
}