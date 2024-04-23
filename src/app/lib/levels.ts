import { ComponentNode } from "../(navigational)/level/Components";

export type Test = {
    inData: number[],
    outData: number[],
}

export type Tests = {
    inArgs: string[],
    outArgs: string[],
    data: Test[],
}

export type Level = {
    name: string,
    description: string,
    tests: Tests,
    components: string[],
    inComponents: string[],
    outComponents: string[],
    userTestsCount: number,
    hint: string,   
};

export let levels: Level[] = [
    {
        name: "Nand",
        description: `Here we go with the first level.
Your first task is to make the most basic logical element Nand. This element return 0 only if both inputs are 1. In any other circumstances it returns 1
You have two relay logic gates. Try to find, when they will output the needed signal.
Good luck!`,
        tests: {
            inArgs: ["a", "b", "v"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0, 0, 1],
                    outData: [1]
                },
                {
                    inData: [0, 1, 1],
                    outData: [1]
                },
                {
                    inData: [1, 0, 1],
                    outData: [1]
                },
                {
                    inData: [1, 1, 1],
                    outData: [0]
                },
            ], 
        },
        components: ["OffRelay", "OnRelay", "Nand"],
        inComponents: ["ChangeBinaryInput", "ChangeBinaryInput", "VoltageInput"],
        outComponents: ["Output"],
        userTestsCount: Infinity,
        hint: "This level can be done using 2 separate relay gates"
    },
];

export default levels;