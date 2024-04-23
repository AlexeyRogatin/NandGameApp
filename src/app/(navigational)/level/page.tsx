"use client"

import BreakingParagraph from "@/app/components/BreakingParagraph";
import levels from "@/app/lib/levels";
import { useSearchParams } from "next/navigation";
import LevelCanvas from "./LevelCanvas";
import { useState } from "react";
import Dialog from "./Dialog";

export default function Level() {
    const params = useSearchParams();
    let name = params.get("level");
    let level = levels.find((lvl) => lvl.name === name);

    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const showHint = () => {
        setIsDialogOpen(true);
    };
    const handleCloseDialog = () => {
        setIsDialogOpen(false);
    };
    
    return (
        <div className="flex flex-1 gap-20">
            <div className="flex flex-col flex-0 overflow-y w-1/6 gap-10">
                <h2>{level?.name}</h2>
                <BreakingParagraph>{level?.description}</BreakingParagraph>
                <table>
                    <tbody>
                        <tr>
                            {level?.tests.inArgs.map((name, index) => <th key={index}>{name}</th>)}
                            {level?.tests.outArgs.map((name, index) => <th key={index}>{name}</th>)}
                        </tr>
                        {level?.tests.data.map((test, index) => 
                            <tr key={index}>
                                {test.inData.map((v, index) => <td key={index}>{v}</td>)}
                                {test.outData.map((v, index) => <td key={index}>{v}</td>)}
                            </tr>
                        )}
                    </tbody>
                </table>
                <button onClick={showHint} className="bordered">Get a hint</button>
                <Dialog isOpen={isDialogOpen} text={level!.hint} buttonText="Close" onClose={handleCloseDialog} />
            </div>
            <div className="flex-1">
                <LevelCanvas level={level!}/>
            </div>
        </div>
    );
}