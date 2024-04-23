import Link from "next/link";

export default function Authorization({children}: {children: React.ReactNode;}) {
    return (
        <div className="flex h-full flex-col content-evenly justify-around">
            <div className="w-full flex justify-center content-center gap-100">
                <div className="max-w-md bordered flex flex-col gap-30">
                    <h2>Note before authorizing</h2>
                    <div>
                        <p>
                            Registration and authorization is not necessary for completing the course, 
                            but it is needed to save your progress between different browsers and
                            comparing your result to the results of others.
                        </p> 
                        <p>
                            If you don't have an account on this site you need to register it first.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-30">
                    <div className="flex gap-10">
                        <Link href="/authorization" className="bordered">Authorization</Link>
                        <Link href="/registration" className="bordered">Registration</Link>
                    </div>
                    {children}
                </div>
            </div> 
        </div>
    );
}