
import User from "@/lib/database/entities/User";
import Link from "next/link";


export default async function RegistrationSucess(
    {
        params
    }: {
        params: { userToken: string }
    })
{
    const { userToken } = params;

    console.log(userToken);

    const user = await User.decode(userToken);

    console.log(user);

    if (!user) {
        throw new Error("User can't be found");
    }

    user.veryfied = true;
    const success = await user.set(user.email);

    if (!success) {
        throw new Error("Error updating veryfied value");
    }

    return (
        <div className="flex w-full h-full justify-around content-center flex-wrap">
            <div className="flex flex-col flex-wrap content-center gap-50">
                <h2>Your registration has been complete</h2>
                <Link href="/authorization" className="bordered">Go to authorization</Link>
            </div>
        </div>
    )
}