'use client'

import axios from "axios";
import { useRouter } from "next/navigation";

export default function ExitButton() {
    const router = useRouter();
    
    const handleExit = () => {
        axios.post("/api/deauthorization")
            .then((response) => {
                router.push("/levels");
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    }
    
    return (
        <button onClick={handleExit}>Exit</button>
    )
}