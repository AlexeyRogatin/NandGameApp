import { ComponentNode } from "./Components";

export type Test = {
    inData: number[],
    outData: number[],
    show: boolean,
}

export type Tests = {
    inArgs: string[],
    outArgs: string[],
    data: Test[],
    show: boolean;
}

export type Level = {
    name: string,
    description: string,
    tests: Tests,
    components: string[],
    inComponents: string[],
    outComponents: string[],
    hint: string,   
};

export type Section = {
    name: string;
    count: number;
}

export let sections: Section[] = [
    {
        name: "Logic elements",
        count: 5,
    },
    {
        name: "Arithmetics",
        count: 6,
    },
    {
        name: "Routing",
        count: 2,
    }
]

export let levels: Level[] = [
    {
        name: "Nand",
        description: `Here we go with the first level.
Your first task is to make the most basic logical element BitNand. This element return 0 only if both inputs are 1. In any other circumstances it returns 1
You have two relay logic gates. Try to find, when they will output the needed signal.
Good luck!`,
        tests: {
            inArgs: ["a", "b", "v"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0, 0, 1],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [0, 1, 1],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 0, 1],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 1, 1],
                    outData: [0],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["OffRelay", "OnRelay"],
        inComponents: ["ChangeBinaryInput", "ChangeBinaryInput", "VoltageInput"],
        outComponents: ["Output"],
        hint: "This level can be done using 2 separate relay gates"
    },

    {
        name: "Invert",
        description: `If you are here, it means that you have successfully managed to make a Nand element. Now you have it in your disposal.
From now we will start to make basic logical elements.
The first element is Invert. It takes a value and outputs it inverted.
For examples look at a table below`,
        tests: {
            inArgs: ["a"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1],
                    outData: [0],
                    show: true,
                }
            ], 
            show: true, 
        },
        components: ["Nand"],
        inComponents: ["ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: "Several wires can be connected to one output"
    },

    {
        name: "And",
        description: `Let's not get far the oven.
Now make a And element.
I think you might already know the solution.`,
        tests: {
            inArgs: ["a", "b"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 1],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1, 1],
                    outData: [1],
                    show: true,
                },
            ], 
            show: true, 
        },
        components: ["Nand", "Invert"],
        inComponents: ["ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: "No hint here, just fun fact: Do you know that BitNAND stands for NO AND?"
    },

    {
        name: "Or",
        description: `Wow, that was quick.
Your next assignment is to make an element, which returns 1 if one or more of its inputs are 1.`,
        tests: {
            inArgs: ["a", "b"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 1],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 1],
                    outData: [1],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And"],
        inComponents: ["ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: "It returns 0 only if BOTH its inputs are 0, while BitNand does it for both 1"
    },

    {
        name: "Xor",
        description: `This one is not very useful for what we are doing, but it would be inpolite to forget it.
Xor element return 1 if one and only one of its two inputs is 1.`,
        tests: {
            inArgs: ["a", "b"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 1],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 1],
                    outData: [0],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And", "Or"],
        inComponents: ["ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: "Its like middle ground between Or and BitNand"
    },

    {
        name: "Half adder",
        description: `That's all logical elements that we would need.
At this point, you probably would think that it is not sufficient to make a computer out of that, so we will start making arithmetical operations.
This element is called Hald adder. Basically, it adds two bit numbers and stores a value in S output (sum). Moreover, if there is an overflow, it will store 1 in C flag (carry).
Look at a table below for examples:`,
        tests: {
            inArgs: ["a", "b"],
            outArgs: ["c", "s"],
            data: [
                {
                    inData: [0, 0],
                    outData: [0, 0],
                    show: true,
                },
                {
                    inData: [0, 1],
                    outData: [0, 1],
                    show: true,
                },
                {
                    inData: [1, 0],
                    outData: [0, 1],
                    show: true,
                },
                {
                    inData: [1, 1],
                    outData: [1, 0],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor"],
        inComponents: ["ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["Output", "Output"],
        hint: "Try to look at result table excluding one of the two output columns, don't try to make two at once."
    },

    {
        name: "Full adder",
        description: `Full adder is a Half adder, but with one more input. This input is needed for the carry value and it helps with consecutive adding.
In the table below you can see, what happens if C input is 1.`,
        tests: {
            inArgs: ["a", "b", "c"],
            outArgs: ["c", "s"],
            data: [
                {
                    inData: [0, 0, 0],
                    outData: [0, 0],
                    show: false,
                },
                {
                    inData: [0, 1, 0],
                    outData: [0, 1],
                    show: false,
                },
                {
                    inData: [1, 0, 0],
                    outData: [0, 1],
                    show: false,
                },
                {
                    inData: [1, 1, 0],
                    outData: [1, 0],
                    show: false,
                },
                {
                    inData: [0, 0, 1],
                    outData: [0, 1],
                    show: true,
                },
                {
                    inData: [0, 1, 1],
                    outData: [1, 0],
                    show: true,
                },
                {
                    inData: [1, 0, 1],
                    outData: [1, 0],
                    show: true,
                },
                {
                    inData: [1, 1, 1],
                    outData: [1, 1],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor", "HalfAdder"],
        inComponents: ["ChangeBinaryInput", "ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["Output", "Output"],
        hint: "That's like adding 3 bits, you need to use several Half adders."
    },

    {
        name: "Numbers",
        description: `We now that components operate with signals 0 and 1, but it is not sufficient for our purposes.
So, our job is to encode every number with the help of just 0 and 1.
Bit encoding is very similar to decimal encoding, which we use in our life.
We divide powers of a number by ones, tens, hundreds, thousands and so on.
In computer powers are divided by ones, twos, fours, eights and so on.

Here you have an input component with 8 binary outputs (they output 0 or 1). Imagine if each of these outputs have a binary power and the number, which they encode is the sum of all of these outputs.

For example:
1 -> 1 = 1
10 -> 2 + 0 = 2
11 -> 2 + 1 = 3
101 -> 4 + 0 + 1 = 5
10101 -> 16 + 0 + 4 + 0 + 1 = 21

Have some time to properly understand it.`,
        tests: {
            inArgs: ["a"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0],
                    outData: [0],
                    show: false,
                },
                {
                    inData: [1],
                    outData: [1],
                    show: false,
                },
                {
                    inData: [3],
                    outData: [3],
                    show: false,
                },
                {
                    inData: [5],
                    outData: [5],
                    show: false,
                },
                {
                    inData: [9],
                    outData: [9],
                    show: false,
                },
                {
                    inData: [17],
                    outData: [17],
                    show: false,
                },
                {
                    inData: [33],
                    outData: [33],
                    show: false,
                },
                {
                    inData: [65],
                    outData: [65],
                    show: false,
                },
                {
                    inData: [127],
                    outData: [127],
                    show: false,
                },
                {
                    inData: [255],
                    outData: [255],
                    show: false,
                },
            ], 
            show: false,
        },
        components: [],
        inComponents: ["8BitInput"],
        outComponents: ["8BitOutput"],
        hint: "That's a showcase level, so just connect opposing inputs and outputs"
    },

    {
        name: "Addition",
        description: `Full adder is only useful for adding zeros and ones, but we need something, that would add numbers.
Now you are working in numbers. As you have learned from the recent level, every number is a sequence of zeros and ones (bit numbers).
In this assignment you have two 2bit numbers. You need to find their sum and output it as 2bit number.`,
        tests: {
            inArgs: ["a", "b"],
            outArgs: ["c", "x"],
            data: [
                {
                    inData: [0, 0],
                    outData: [0, 0],
                    show: true,
                },
                {
                    inData: [0, 1],
                    outData: [0, 1],
                    show: true,
                },
                {
                    inData: [1, 0],
                    outData: [0, 1],
                    show: false,
                },
                {
                    inData: [1, 1],
                    outData: [0, 2],
                    show: true,
                },
                {
                    inData: [2, 0],
                    outData: [0, 2],
                    show: false,
                },
                {
                    inData: [0, 2],
                    outData: [0, 2],
                    show: true,
                },
                {
                    inData: [2, 1],
                    outData: [0, 3],
                    show: true,
                },
                {
                    inData: [1, 2],
                    outData: [0, 3],
                    show: false,
                },
                {
                    inData: [2, 2],
                    outData: [1, 0],
                    show: true,
                },
                {
                    inData: [3, 2],
                    outData: [1, 1],
                    show: true,
                },
                {
                    inData: [2, 3],
                    outData: [1, 1],
                    show: false,
                },
                {
                    inData: [3, 3],
                    outData: [1, 2],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor", "HalfAdder", "FullAdder"],
        inComponents: ["2BitInput", "2BitInput"],
        outComponents: ["Output", "2BitOutput"],
        hint: "Use carry from one full adder in another full adder"
    },

    {
        name: "Negative numbers",
        description: `With addition, we can make almost all functions in computer, but we shouldn't forget about subtraction.
But before that, let's discuss, how negative numbers are represented in computer.
Negative numbers are stored in a complimentary form. What this means is that the greatest bit now represents a negative number and if this bit is 1, this number will be subtracted from the result.
Try to find the difference between negative and positive numbers in this form.
What do you need to do to make a positive number into negative one and vice versa`,
        tests: {
            inArgs: ["a"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0],
                    outData: [0],
                    show: false,
                },
                {
                    inData: [1],
                    outData: [1],
                    show: false,
                },
                {
                    inData: [3],
                    outData: [3],
                    show: false,
                },
                {
                    inData: [5],
                    outData: [5],
                    show: false,
                },
                {
                    inData: [9],
                    outData: [9],
                    show: false,
                },
                {
                    inData: [17],
                    outData: [17],
                    show: false,
                },
                {
                    inData: [33],
                    outData: [33],
                    show: false,
                },
                {
                    inData: [65],
                    outData: [65],
                    show: false,
                },
                {
                    inData: [127],
                    outData: [127],
                    show: false,
                },
                {
                    inData: [-1],
                    outData: [-1],
                    show: false,
                },
                {
                    inData: [-3],
                    outData: [-3],
                    show: false,
                },
                {
                    inData: [-5],
                    outData: [-5],
                    show: false,
                },
                {
                    inData: [-9],
                    outData: [-9],
                    show: false,
                },
                {
                    inData: [-17],
                    outData: [-17],
                    show: false,
                },
                {
                    inData: [-33],
                    outData: [-33],
                    show: false,
                },
                {
                    inData: [-65],
                    outData: [-65],
                    show: false,
                },
                {
                    inData: [-127],
                    outData: [-127],
                    show: false,
                },
            ], 
            show: false,
        },
        components: [],
        inComponents: ["8BitSubInput"],
        outComponents: ["8BitSubOutput"],
        hint: "That's a showcase level, so just connect opposing inputs and outputs"
    },

    {
        name: "Subtraction",
        description: `From now on we will represent a number with just one wire. This is made just not to make it too crowded. To accomodate to this, your commands now work with 8bit numbers.

Subtraction in computer works exactly like in maths, you just need to add one number to the other number, taken with an oposite sign.
The main challenge for you is to make a number change its sign. This is tricky, and if you have problems, then hint might slightly help you.`,
        tests: {
            inArgs: ["a", "b", "v"],
            outArgs: ["x"],
            data: [
                {
                    inData: [5, 3, 1],
                    outData: [2],
                    show: true,
                },
                {
                    inData: [5, -3, 1],
                    outData: [8],
                    show: true,
                },
                {
                    inData: [-5, -3, 1],
                    outData: [-2],
                    show: true,
                },  
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor", "Add"],
        inComponents: ["NumberInput", "NumberInput", "VoltageInput"],
        outComponents: ["Output"],
        hint: "Invert a number and add 1 to it to change its sign."
    },

    {
        name: "Multiplexor",
        description: `To work with specific data we need to have some routing elements.
Multiplexor component takes several value inputs and one binary control input, which tells which of the two values to output.`,

        tests: {
            inArgs: ["a", "b", "c"],
            outArgs: ["x"],
            data: [
                {
                    inData: [1, 2, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 2, 1],
                    outData: [2],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor"],
        inComponents: ["NumberInput", "NumberInput", "ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: "Use carry from one full adder in another full adder"
    },
];

export default levels;