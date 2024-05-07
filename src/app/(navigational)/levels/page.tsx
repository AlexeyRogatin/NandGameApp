import levels, { sections } from "@/app/lib/scheme/levels";
import Link from "next/link";

export default function Levels() {
    return (
        <div className="flex flex-row flex-wrap gap-50">
            {
                sections.map((section, index) => {
                    let startLevel = sections.slice(0, index).reduce((acc, cur) => acc += cur.count, 0);
                    let endLevel = startLevel + section.count;
                    return (
                        <div className="flex flex-col flex-wrap gap-30 content-start" key={index}>
                            <h3>{section.name}</h3>
                            {
                                levels.slice(startLevel, endLevel).map((level, index) => {
                                    return (
                                        <Link href={"level?level=" + level.name} key={index} className="bordered">{level.name}</Link>
                                    )
                                })
                            }
                        </div>
                    )
                })
            }
        </div>
    )
}