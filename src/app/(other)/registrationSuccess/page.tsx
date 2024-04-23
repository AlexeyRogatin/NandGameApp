import Link from "next/link";

export default function RegistrationSucess() {
    return (
        <div className="flex w-full h-full justify-around content-center flex-wrap">
            <div className="flex flex-col flex-wrap content-center gap-50">
                <h2>Your registration has been complete</h2>
                <Link href="/authorization" className="bordered">Go to authorization</Link>
            </div>
        </div>
    );
}