"use client"

import BreakingParagraph from "@/app/lib/components/BreakingParagraph";
import levels from "@/app/lib/scheme/levels";
import { useRouter, useSearchParams } from "next/navigation";
import LevelCanvas from "./LevelCanvas";
import { useState } from "react";
import Dialog from "../../lib/components/Dialog";
import axios from "axios";
import { FailedTest, Scheme } from "../../lib/scheme/Components";

type Results = {
    components: number,
    nands: number
}

export default function Level() {
    const router = useRouter();

    const params = useSearchParams();
    const name = params.get("level");
    const levelIndex = levels.findIndex((level) => level.name === name);
    const level = levels[levelIndex];

    const [scheme, setScheme] = useState<Scheme>(new Scheme());
    const [hintOpen, setHintOpen] = useState(false);
    const [resultOpen, setResultOpen] = useState(false);
    const [results, setResults] = useState<Results>({components: 0, nands: 0});
    const [failsOpen, setFailsOpen] = useState(false);
    const [fails, setFails] = useState<FailedTest[]>([]);

    const handleCheck = () => {
        axios.post("/api/solve", scheme.pack(level!))
            .then((response) => {
                if (response.data.success) {
                    setResultOpen(true);
                    setResults({components: response.data.componentCount, nands: response.data.nandCount});
                } else {
                    setFailsOpen(true);
                    setFails(response.data.failedTests);
                }
            })
            .catch((error) => {
                alert(error.response.data.error);
            });
    };
    
    return (
        <>
            <div className="flex flex-1 gap-20">
                <div className="flex flex-col w-1/6 justify-between flex-wrap">
                    <div className="flex flex-col flex overflow-y gap-10">
                        <h2>{level?.name}</h2>
                        <BreakingParagraph>{level?.description}</BreakingParagraph>
                        {level.tests.show && 
                        <table>
                            <tbody>
                                <tr>
                                    <th colSpan={level.tests.inArgs.length}>Input</th>
                                    <th colSpan={level.tests.outArgs.length}>Output</th>
                                </tr>
                                <tr>
                                    {level?.tests.inArgs.map((name, index) => <th key={index}>{name}</th>)}
                                    {level?.tests.outArgs.map((name, index) => <th key={index}>{name}</th>)}
                                </tr>
                                {level?.tests.data.map((test, index) => {
                                        return test.show
                                        && <tr key={index}>
                                            {test.inData.map((v, index) => <td key={index}>{v}</td>)}
                                            {test.outData.map((v, index) => <td key={index}>{v}</td>)}
                                        </tr>
                                    }
                                )}
                            </tbody>
                        </table>}
                        <button onClick={() => {setHintOpen(true)}} className="bordered">Get a hint</button>
                        
                    </div>
                    <div className="w-full">
                        <button onClick={handleCheck} className="bordered w-full">Check solution</button>
                    </div>
                </div>
                <div className="flex-1">
                    <LevelCanvas level={level!} setScheme={setScheme}/>
                </div>
            </div>

            <Dialog isOpen={hintOpen} buttonText="Close" onClose={() => {setHintOpen(false)}}>
                <BreakingParagraph>{level!.hint}</BreakingParagraph>
            </Dialog>

            <Dialog isOpen={resultOpen} buttonText={levelIndex + 1 !== levels.length ? "To the next level": "To level selection"} onClose={() => {
                    setResultOpen(false);
                    if (levelIndex + 1 !== levels.length) {
                        router.push("level?level=" + levels[levelIndex + 1].name);
                    } else {
                        router.push("levels");
                    }
                }}>
                <p>
                    Your solution is correct. It has {results.components} components {results.nands !== 0 && <>and {results.nands} Nand elements.</>}
                </p>
            </Dialog>

            <Dialog isOpen={failsOpen} buttonText="Close" onClose={() => {setFailsOpen(false)}}>
                <p>Solution failed some tests:</p>
                <table>
                    <tbody>
                        <tr>
                            <th colSpan={level.tests.inArgs.length}>Input</th>
                            <th colSpan={level.tests.outArgs.length}>Expected</th>
                            <th colSpan={level.tests.outArgs.length}>Real</th>
                        </tr>
                        <tr>
                            {level?.tests.inArgs.map((name, index) => <th key={index}>{name}</th>)}
                            {level?.tests.outArgs.map((name, index) => <th key={index}>{name}</th>)}
                            {level?.tests.outArgs.map((name, index) => <th key={index}>{name}</th>)}
                        </tr>
                        {fails.slice(0, 10).map((fail, index) => {
                            let test = level.tests.data[fail.testIndex];
                            return <tr key={index}>
                                {test.inData.map((data, index) => <td key={index}>{data}</td>)}
                                {test.outData.map((data, index) => <td key={index}>{data}</td>)}
                                {fail.outArgs.map((data, index) => <td key={index}>{data}</td>)}
                            </tr>
                        })}
                    </tbody>
                </table>
            </Dialog>
        </>
    );
}