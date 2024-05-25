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
    },
    {
        name: "ALU",
        count: 3,
    },
    {
        name: "Memory",
        count: 7,
    }
]

export let levels: Level[] = [
    {
        name: "Nand",
        description: `Welcome to the first level!
In the right you have a working area.
Your first task is to make the most basic logical element Nand. This element returns 0 only if both inputs are 1. In any other circumstances it returns 1
You have two relay logic gates. Try to find, when they will output the needed signal.
Try to experiment with elements and links.
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
The first element is Invert. It takes a value and outputs it inverted. It is often called Not.
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
        description: `Let's not get far from the oven.
Now its time to make an And element.
I solution is easier, if you think about what the word Nand means`,
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
        hint: "No hint here, just fun fact: Do you know that Nand stands for NO AND?"
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
        hint: "It returns 0 only if BOTH its inputs are 0, while Nand does it for both 1"
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
        hint: "Its like middle ground between Or and Nand"
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
        name: "Multiplexer",
        description: `To work with specific data we need to have some routing elements.
Multiplexor component takes several value inputs and one binary control input, which tells which of the two values to output.`,

        tests: {
            inArgs: ["a", "b", "c"],
            outArgs: ["x"],
            data: [
                {
                    inData: [1, 0, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 0, 1],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 1, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 1, 1],
                    outData: [1],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor"],
        inComponents: ["ChangeBinaryInput", "ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: "Try to use AND to combine control input with each of value inputs and then use OR on them"
    },

    {
        name: "Demultiplexer",
        description: `Demultiplexor component is a polar opposite of multiplexor. 
It takes one value input and one binary control input, which tells which of the two outputs gets this value.`,

        tests: {
            inArgs: ["x", "c"],
            outArgs: ["a", "b"],
            data: [
                {
                    inData: [0, 0],
                    outData: [0, 0],
                    show: false,
                },
                {
                    inData: [0, 1],
                    outData: [0, 0],
                    show: false,
                },
                {
                    inData: [1, 0],
                    outData: [1, 0],
                    show: true,
                },
                {
                    inData: [1, 1],
                    outData: [0, 1],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor"],
        inComponents: ["ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["Output", "Output"],
        hint: "Determine how to get correct results for one output and then for another"
    },

    {
        name: "Logic unit",
        description: `When computer is looking at some numbers, it doesn't know, what to do with them, so we need to give it some signals (flags), so it will know the operation to do with these numbers.
        
Logic unit takes two numbers and performs a logical oparation with them.

Which logical operation is performed is determined by combination of 2 flags:
op0 = 0 and op1 = 0 -> a AND b
op0 = 0 and op1 = 1 -> a OR b
op0 = 1 and op1 = 0 -> a XOR b
op0 = 1 and op1 = 1 -> INV a`,
        tests: {
            inArgs: ["a", "b", "op0", "op1"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0, 0, 0, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 1, 0, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1, 0, 0, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1, 1, 0, 0],
                    outData: [1],
                    show: true,
                },
                
                {
                    inData: [0, 0, 0, 1],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 1, 0, 1],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 0, 0, 1],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 1, 0, 1],
                    outData: [1],
                    show: true,
                }, 

                {
                    inData: [0, 0, 1, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 1, 1, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 0, 1, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 1, 1, 0],
                    outData: [0],
                    show: true,
                }, 

                {
                    inData: [0, 0, 1, 1],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [0, 1, 1, 1],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 0, 1, 1],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1, 1, 1, 1],
                    outData: [0],
                    show: true,
                }, 
            ], 
            show: false,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor", "Mux", "Demux"],
        inComponents: ["NumberInput", "NumberInput", "ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: "Use MUX to choose the right output operation"
    },

    {
        name: "Arithmetics unit",
        description: `It's a similar thing to Logic unit, but for arithmetic operations.
        
op0 = 0 and op1 = 0 -> a + b
op0 = 0 and op1 = 1 -> a - b
op0 = 1 and op1 = 0 -> a + 1
op0 = 1 and op1 = 1 -> a - 1`,
tests: {
    inArgs: ["a", "b", "op0", "op1"],
    outArgs: ["x"],
    data: [
            {
                inData: [5, 3, 0, 0],
                outData: [8],
                show: true,
            },
            {
                inData: [5, 3, 0, 1],
                outData: [2],
                show: true,
            },
            {
                inData: [5, 3, 1, 0],
                outData: [6],
                show: true,
            },
            {
                inData: [5, 3, 1, 1],
                outData: [4],
                show: true,
            },
        ], 
        show: true,
    },
        components: ["VoltageInput", "Add", "Sub", "Mux", "Demux"],
        inComponents: ["NumberInput", "NumberInput", "ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: "Use MUX to choose the right output operation and second operand"
    },

    {
        name: "ALU",
        description: `Arithmetics Logic unit combines functionality of both units.
        
When U flag is 0, use logic unit
When U flag is 1, use arithmetics unit`,
        tests: {
            inArgs: ["a", "b", "op0", "op1", "u"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0, 0, 0, 0, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 1, 0, 0, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1, 0, 0, 0, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1, 1, 0, 0, 0],
                    outData: [1],
                    show: true,
                },
                
                {
                    inData: [0, 0, 0, 1, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 1, 0, 1, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 0, 0, 1, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 1, 0, 1, 0],
                    outData: [1],
                    show: true,
                }, 

                {
                    inData: [0, 0, 1, 0, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 1, 1, 0, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 0, 1, 0, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 1, 1, 0, 0],
                    outData: [0],
                    show: true,
                }, 

                {
                    inData: [0, 0, 1, 1, 0],
                    outData: [~0],
                    show: true,
                },
                {
                    inData: [0, 1, 1, 1, 0],
                    outData: [~0],
                    show: true,
                },
                {
                    inData: [1, 0, 1, 1, 0],
                    outData: [~1],
                    show: true,
                },
                {
                    inData: [1, 1, 1, 1, 0],
                    outData: [~1],
                    show: true,
                },  
                
                {
                    inData: [5, 3, 0, 0, 1],
                    outData: [8],
                    show: true,
                },
                {
                    inData: [5, 3, 0, 1, 1],
                    outData: [2],
                    show: true,
                },
                {
                    inData: [5, 3, 1, 0, 1],
                    outData: [6],
                    show: true,
                },
                {
                    inData: [5, 3, 1, 1, 1],
                    outData: [4],
                    show: true,
                },
            ], 
            show: false,
        },
        components: ["Add", "Sub", "Mux", "Demux", "Logic", "Arith"],
        inComponents: ["NumberInput", "NumberInput", "ChangeBinaryInput", "ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: "Use MUX, MUX will save the world"
    },

    {
        name: "Short circuit",
        description: `Before that we connected elements in a tree-like manner, each element is connected to the next.
It means that the value of the next element is fully determined by values of previous elements.
But, if you make a cycle in your scheme, the next value of component will also somehow be determined by the previous value of this very component.
This is a very crucial feature to store a signal. Let's start by making an element, which outputs 0, but if it gets 1 as an inputs even for one second, it will start to output 1`,

        tests: {
            inArgs: ["a"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [0],
                    outData: [1],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor"],
        inComponents: ["ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: "You just need one OR for that"
    },
    {
        name: "RS Flip-flop",
        description: `Flip-flop is a memory cell with two states:
* Stores 0
* Stores 1

It is called like that, because it is able to change (flip) between these two states.

Reset Set Flip-Flop is named after its inputs.

If R (reset) input is 1 and S (set) is 0, it flips to 0.

If R (reset) input is 0 and S (set) is 1, it flips to 1.

When R and S are both 0, it stores its value.`,

        tests: {
            inArgs: ["s", "r"],
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
                    inData: [0, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [0, 0],
                    outData: [1],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor"],
        inComponents: ["ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: "Intersect two NANDs inputs and outputs. Than use two INV to invert input signals"
    },

    {
        name: "D Flip-flop",
        description: `RS Flip-flop is great, but it is hard to use, so we need a better one.

Make a Flip-flop with two inputs:

D - value, you want to write to a memory cell
C - control input`,

        tests: {
            inArgs: ["d", "c"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0, 0],
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
                {
                    inData: [0, 1],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1, 1],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [1, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [0, 0],
                    outData: [1],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor", "RS"],
        inComponents: ["ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: "When you want to flip, one input always has an inverted value of another. When you are not flipping, just nullify all inputs"
    },

    {
        name: "MS Flip-flop",
        description: `When we are working with memory, we need to apply changes to all memory cells at once, so we need to add another input.

S - flip-flop flips its value only when value of this input changes from 1 to 0.

Master Slave Flip-flop consists of two Flip-flops.

When S signal turns to 1 the first flip-flop stores the value of D. 

When S signal turns to 0 the second flip-flop stores the value from the first one.`,

        tests: {
            inArgs: ["d", "c", "s"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0, 1, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1, 1, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1, 1, 1],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1, 1, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [0, 1, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [0, 1, 1],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [0, 0, 1],
                    outData: [1],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor", "RS", "D"],
        inComponents: ["ChangeBinaryInput", "ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: `Use two D Flip-Flops.
One will get its value, when S and C are 1, and the second one - when S is 0`
    },

    {
        name: "Memory cell",
        description: `To store all the information, we would need a lot of these, so show me, how to make a Memory cell, which will store 2bit numbers`,

        tests: {
            inArgs: ["d", "c", "s"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0, 1, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [3, 1, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [3, 1, 1],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [3, 1, 0],
                    outData: [3],
                    show: true,
                },
                {
                    inData: [0, 1, 0],
                    outData: [3],
                    show: true,
                },
                {
                    inData: [0, 1, 1],
                    outData: [3],
                    show: true,
                },
                {
                    inData: [0, 0, 1],
                    outData: [3],
                    show: true,
                },
            ], 
            show: true,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor", "MS"],
        inComponents: ["2BitInput", "ChangeBinaryInput", "ChangeBinaryInput"],
        outComponents: ["2BitOutput"],
        hint: `Just use one MS Flip-flop for each respective output and input of a 2bit number`
    },

    {
        name: "Counter",
        description: `Counter is a special memory cell, which increases its value by 1 each time syncronization signal changes from 1 to 0 (let's call it tick).

It has two states indicated by st input.

When ST input is 0 register works as a counter

When ST input is 1 register stores a value inducated by X input

So, maybe rummage a little bit and try to create a solution.`,

        tests: {
            inArgs: ["st", "x", "s"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0, -33, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 111, 1],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 134, 0],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [0, 1, 1],
                    outData: [1],
                    show: true,
                },
                {
                    inData: [0, 0, 0],
                    outData: [2],
                    show: true,
                },
                {
                    inData: [1, 122, 1],
                    outData: [2],
                    show: true,
                },
                {
                    inData: [1, 122, 0],
                    outData: [122],
                    show: true,
                },
                {
                    inData: [1, 0, 1],
                    outData: [122],
                    show: true,
                },
                {
                    inData: [1, 0, 0],
                    outData: [0],
                    show: true,
                },
            ], 
            show: false,
        },
        components: ["Nand", "Invert", "And", "Or", "VoltageInput", "Add", "Mux", "MemoryCell"],
        inComponents: ["ChangeBinaryInput", "NumberInput", "ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: `You can carry a value from the output of memory cell, modify the value and set it back`
    },

    {
        name: "RAM",
        description: `Now we have means to store information in memory cells, but we still need means to access them.

Random Access Memory is a memory, that can be read or changed in any order.

For example purposes, we will make a memory out of two memory cells.

There are two flags:

AD (Address flag), which tells, from which cell value to output

ST (Store flag), which tells, if the value of X should be stored to a AD cell`,

        tests: {
            inArgs: ["ad", "st", "x", "s"],
            outArgs: ["x"],
            data: [
                {
                    inData: [0, 0, 0, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 0, 1, 1],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 0, 1, 0],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 1, 5, 1],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [0, 1, 5, 0],
                    outData: [5],
                    show: true,
                },
                {
                    inData: [1, 1, 3, 1],
                    outData: [0],
                    show: true,
                },
                {
                    inData: [1, 1, 3, 0],
                    outData: [3],
                    show: true,
                },
                {
                    inData: [0, 0, 0, 0],
                    outData: [5],
                    show: true,
                },
                {
                    inData: [1, 0, 0, 0],
                    outData: [3],
                    show: true,
                },
            ], 
            show: false,
        },
        components: ["Nand", "Invert", "And", "Or", "Xor", "Mux", "Demux", "MemoryCell"],
        inComponents: ["ChangeBinaryInput", "ChangeBinaryInput", "NumberInput", "ChangeBinaryInput"],
        outComponents: ["Output"],
        hint: `Use MUX and DEMUX to correctly access memory cells`
    },
];

export default levels;