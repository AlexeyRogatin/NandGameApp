import levels from "@/app/lib/levels";
import Link from "next/link";

export default function Levels() {
    return (
        <div className="flex flex-col flex-wrap gap-30 content-start">
            {
                levels.map((level, index) => {
                    return (
                        <Link href={"level?level=" + level.name} key={index} className="bordered">{level.name}</Link>
                    )
                })
            }
        </div>
    )
}