import { Component } from "react";
import Mouse from "./Mouse";
import levels, { Level } from "@/app/lib/scheme/levels";
import Keyboard from "./Keyboard";

export type ComponentFunction = {
    (arg: Number[]): Number[];
}

export type LinkFunction = {
    (): Number
}

export let NULL_FUNCTION: ComponentFunction = () => [0];

export let NULL_LINK_FUNCTION: LinkFunction = () => 0;

function Leave8BitsSigned(number: number) {
    let sign = Math.floor(number / 128) % 2 === 1 ? -1 : 1;
    return sign * number % 128;
}

function Leave8Bits(number: number) {
    return number & 256;
}

function Leave1Bit(number: number) {
    return number & 1;
}

enum SchemeNodeType {
    BINARY,
    NUMERIC,
    SIGNED,
    SYNCH
}

export class SchemeNode {
    x: number;
    y: number;
    name: string;
    type: SchemeNodeType;
    realType: SchemeNodeType;
    computeFunction: LinkFunction;
    value: number = NaN;
    RADIUS = 10;
    WIDTH = 3;
    TRIANGLE = 6;

    constructor(x: number, y: number, name: string, type = SchemeNodeType.BINARY, computeFunction: LinkFunction = NULL_LINK_FUNCTION) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.type = type;
        if (this.type === SchemeNodeType.SYNCH) {
            this.realType = SchemeNodeType.BINARY;
        } else {
            this.realType = type;
        }
        this.computeFunction = computeFunction;
    }

    getValue () {
        if (isNaN(this.value)) {
            this.value = this.computeFunction().valueOf();
        } 
        switch (this.realType) {
            case SchemeNodeType.BINARY: {
                this.value = Leave1Bit(this.value.valueOf());
            } break;
            case SchemeNodeType.NUMERIC: {
                this.value = Leave8Bits(this.value.valueOf());
            } break;
            case SchemeNodeType.SIGNED: {
                this.value = Leave8BitsSigned(this.value.valueOf());
            } break;
            default: {
                this.value = this.value;
            }
        }
        
        return this.value;
    }

    clearValue () {
        this.value = NaN;
    }

    draw (ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, 
        activeColor: string | CanvasGradient | CanvasPattern,  backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {}
    
    collide (mouse: Mouse, multiplier: number) {
        return Math.abs(mouse.x - this.x * multiplier) <= this.RADIUS && Math.abs(mouse.y - this.y * multiplier) <= this.RADIUS;
    }
}

export class OutputNode extends SchemeNode {
    checked: boolean = false;
    recentValue: number = 0;

    constructor(x: number, y: number, name: string, type = SchemeNodeType.BINARY, computeFunction: LinkFunction  = NULL_LINK_FUNCTION) {
        super(x, y, name, type, computeFunction);
    } 

    getValue() {
        if (!this.checked) {
            this.checked = true;
            super.getValue();
            this.checked = false;
        } else {
            this.value = this.recentValue;
        }
        return this.value;
    }

    clearValue () {
        this.recentValue = this.value;
        super.clearValue();
        this.checked = false;
    }
    
    draw (ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, 
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {
        

        ctx.fillStyle = backColor;
        ctx.lineWidth = this.WIDTH;

        ctx.beginPath();
        ctx.arc(this.x * multiplier, this.y * multiplier, this.RADIUS, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = color;
        ctx.fillStyle = color;
        if (this.getValue()) {
            ctx.strokeStyle = activeColor;
            ctx.fillStyle = activeColor;
        }
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(this.x * multiplier + this.RADIUS + this.TRIANGLE, this.y * multiplier);
        ctx.lineTo(this.x * multiplier + this.RADIUS, this.y * multiplier + this.TRIANGLE);
        ctx.lineTo(this.x * multiplier + this.RADIUS, this.y * multiplier - this.TRIANGLE);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 14px Consolas";
        ctx.fillText(this.name, this.x * multiplier, this.y * multiplier + 1);
        // ctx.fillText(this.realType.toString(), this.x * multiplier, this.y * multiplier + 1);
    }
}

export class InputNode extends SchemeNode {
    constructor(x: number, y: number, name: string, type = SchemeNodeType.BINARY, computeFunction: LinkFunction  = NULL_LINK_FUNCTION) {
        super(x, y, name, type, computeFunction);
    }   

    draw (ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, 
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {

        ctx.strokeStyle = color;
        if (this.getValue()) {
            ctx.strokeStyle = activeColor;
        }
        ctx.fillStyle = backColor;
        ctx.lineWidth = this.WIDTH;

        ctx.beginPath();
        ctx.arc(this.x * multiplier, this.y * multiplier, this.RADIUS, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "bold 14px Consolas";
        ctx.fillText(this.name, this.x * multiplier, this.y * multiplier + 1);
        // ctx.fillText(this.realType.toString(), this.x * multiplier, this.y * multiplier + 1);
    }
}

export class SchemeLink {
    inputNode: InputNode;
    outputNode: OutputNode;
    
    constructor(outputNode: OutputNode, inputNode: InputNode) {
        this.inputNode = inputNode;
        this.outputNode = outputNode;
        if (this.inputNode.type === SchemeNodeType.SYNCH) {
            this.inputNode.realType = this.outputNode.realType;
        }
        this.inputNode.computeFunction = () => this.getValue();
    }

    destroy () {
        this.inputNode.computeFunction = NULL_LINK_FUNCTION;
        if (this.inputNode.type === SchemeNodeType.SYNCH) {
            this.inputNode.realType = SchemeNodeType.BINARY;
        }
    }

    getValue () {
        return this.outputNode.getValue();
    }

    draw (ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, multiplier: number) {
        const WIDTH = 3;
        ctx.beginPath();
        ctx.moveTo(this.outputNode.x * multiplier, this.outputNode.y * multiplier);
        ctx.lineTo(this.inputNode.x * multiplier, this.inputNode.y * multiplier);
        ctx.closePath();
        ctx.strokeStyle = color;
        if (this.getValue()) {
            ctx.strokeStyle = activeColor;
        }
        ctx.lineWidth = WIDTH;
        ctx.stroke();
    }
}

export enum ComponentType {
    IN,
    OUT,
    DROP_BOX
}

export class ComponentNode {
    x: number;
    y: number;
    width: number = 1;
    height: number = 1;
    inputNodes: InputNode[];
    outputNodes: OutputNode[];
    func: ComponentFunction;
    deletable: boolean;
    nandCount: number;

    type: ComponentType;
    typeIndex: number;

    constructor(type: ComponentType, typeIndex: number, x: number, y: number,
        inputNodes: InputNode[], outputNodes: OutputNode[], func: ComponentFunction, deletable = true, nandCount = 0) {
        this.x = x;
        this.y = y;
        this.outputNodes = outputNodes;
        this.inputNodes = inputNodes;
        this.func = func;
        this.deletable = deletable;
        this.type = type;
        this.typeIndex = typeIndex;
        this.nandCount = nandCount;
        this.initialize();
    }

    initialize() {
        const realFunc = () => {
            let values = this.inputNodes.map((node) => node.getValue());
            return this.func(values);
        }
        for (let index = 0; index < this.outputNodes.length; index++) {
            this.outputNodes[index].computeFunction = () => { 
                if (this.outputNodes[index].type === SchemeNodeType.SYNCH) {
                    let type = SchemeNodeType.SYNCH;
                    for (let inputIndex = 0; inputIndex < this.inputNodes.length; inputIndex++) {
                        if (this.inputNodes[inputIndex].type === SchemeNodeType.SYNCH) {
                            type = this.inputNodes[inputIndex].realType;
                        }
                    }
                    if (this.outputNodes[index].realType !== type) {
                        if (type === SchemeNodeType.BINARY) {
                            this.nandCount /= 8;
                        } else {
                            this.nandCount *= 8;
                        }
                        this.outputNodes[index].realType = type;
                    }
                }
                return realFunc()[index];
            };
        }
    }

    drawBody(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = color;
            ctx.fillStyle = backColor;
            ctx.beginPath();
            ctx.roundRect(this.x * multiplier, this.y * multiplier, multiplier * this.width, multiplier * this.height, 10);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();
    }

    drawNodes(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {
        this.inputNodes.forEach((node) => {node.draw(ctx, color, activeColor, backColor, multiplier)});
        this.outputNodes.forEach((node) => {node.draw(ctx, color, activeColor, backColor, multiplier)});
    }

    draw (ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {
        this.drawBody(ctx, color, activeColor, backColor, multiplier);
        this.drawNodes(ctx, color, activeColor, backColor, multiplier);
    }

    collided (x: number, y: number, multiplier: number) {
        return (
            x >= this.x * multiplier && x <= (this.x + this.width) * multiplier
            && y >= this.y * multiplier && y <= (this.y + this.height) * multiplier 
        );
    }

    changePos (divX: number, divY: number) {
        let changeX = divX;
        let changeY = divY;
        this.x += changeX;
        this.y += changeY;
        this.inputNodes.forEach((node) => {node.x += changeX; node.y += changeY;});
        this.outputNodes.forEach((node) => {node.x += changeX; node.y += changeY;});
    }

    //0 - dragged
    //1 - out of bounds
    drag (mouse: Mouse, multiplier: number, leftBorder: number, rightBorder: number, topBorder: number, bottomBorder: number) {
        let mouseX = mouse.x / multiplier;
        let mouseY = mouse.y / multiplier;

        if (mouse.isDown && this.collided(mouse.recentX, mouse.recentY, multiplier)) {
            let mouseRecentX = mouse.recentX / multiplier;
            let mouseRecentY = mouse.recentY / multiplier;
            if (!this.deletable) {
                mouseX = Math.min(rightBorder - (this.width - (mouseX - this.x)), Math.max(leftBorder + (mouseX - this.x), mouseX));
                mouseY = Math.min(bottomBorder - (this.height - (mouseY - this.y)), Math.max(topBorder + (mouseY - this.y), mouseY));
            }
            this.changePos(mouseX - mouseRecentX, mouseY - mouseRecentY);
            return 0;
        } else {
            if (this.x < leftBorder - 0.5 || this.x + this.width >= rightBorder - 0.5 
                || this.y < topBorder - 0.5 || this.y + this.height >= bottomBorder - 0.5) {
                if (this.deletable) {
                    return 1;
                }
            } else {
                this.changePos(Math.round(this.x) - this.x, Math.round(this.y) - this.y);
            }
        }
    }

    static clone(clone: ComponentNode, proto: ComponentNode) {
        clone.x = proto.x;
        clone.y = proto.y;

        const clonedInputNodes = proto.inputNodes.map((inputNode) => {
            return new InputNode(inputNode.x, inputNode.y, inputNode.name, inputNode.type, inputNode.computeFunction);
        });
        clone.inputNodes = clonedInputNodes;

        const clonedOutputNodes = proto.outputNodes.map((outputNode) => {
            return new OutputNode(outputNode.x, outputNode.y, outputNode.name, outputNode.type, outputNode.computeFunction);
        });
        clone.outputNodes = clonedOutputNodes;

        const clonedFunc = proto.func;
        clone.func = clonedFunc;

        clone.deletable = proto.deletable;
    }

    clone (): ComponentNode {
        const clonedComponentNode = new ComponentNode(this.type, this.typeIndex, this.x, this.y, [], [], NULL_FUNCTION);
        this.cloneNode(clonedComponentNode);
        return clonedComponentNode;
    }

    cloneNode (clonedComponentNode: ComponentNode) {
        ComponentNode.clone(clonedComponentNode, this); 
    }

    handleChanges (mouse: Mouse, keyboard: Keyboard, multiplier: Number) {
    }

    clearValues () {
        this.inputNodes.forEach((node) => node.clearValue());
        this.outputNodes.forEach((node) => node.clearValue());
    }

    getName (level: Level) {
        return ComponentNode.getName(level, this.type, this.typeIndex);
    }

    static getName(level: Level, type: ComponentType, typeIndex: number) {
        switch (type) {
            case ComponentType.DROP_BOX: {
                return level.components[typeIndex];
            }
            case ComponentType.IN: {
                return level.inComponents[typeIndex];
            }
            case ComponentType.OUT: {
                return level.outComponents[typeIndex];
            }
        }
    }
}

export function ComponentGetter(level: Level, type: ComponentType, typeIndex: number, x: number, y: number, componentName = "") {
    switch (ComponentNode.getName(level, type, typeIndex)) {
        case "ChangeBinaryInput": return new ChangeBinaryInput(type, typeIndex, x, y, componentName);
        case "2BitInput": return new Binary2BitInput(type, typeIndex, x, y, componentName);
        case "8BitInput": return new Binary8BitInput(type, typeIndex, x, y, componentName);
        case "8BitSubInput": return new Binary8BitSubInput(type, typeIndex, x, y, componentName);
        case "VoltageInput": return new VoltageInput(type, typeIndex, x, y, componentName);
        case "NumberInput": return new NumberInput(type, typeIndex, x, y, componentName);

        case "Output": return new ComponentOutput(type, typeIndex, x, y, componentName);
        case "2BitOutput": return new Binary2BitOutput(type, typeIndex, x, y, componentName);
        case "8BitOutput": return new Binary8BitOutput(type, typeIndex, x, y, componentName);
        case "8BitSubOutput": return new Binary8BitSubOutput(type, typeIndex, x, y, componentName);

        case "OffRelay": return new ComponentOffRelay(type, typeIndex, x, y);
        case "OnRelay": return new ComponentOnRelay(type, typeIndex, x, y);
        case "Nand": return new ComponentNand(type, typeIndex, x, y);
        case "Invert": return new ComponentInvert(type, typeIndex, x, y);
        case "And": return new ComponentAnd(type, typeIndex, x, y);
        case "Or": return new ComponentOr(type, typeIndex, x, y);
        case "Xor": return new ComponentXor(type, typeIndex, x, y);
        case "HalfAdder": return new ComponentHalfAdder(type, typeIndex, x, y);
        case "FullAdder": return new ComponentFullAdder(type, typeIndex, x, y);
        case "Add": return new ComponentAdder(type, typeIndex, x, y);
        default: return new ComponentNode(type, typeIndex,  x, y, [], [], NULL_FUNCTION);
    }
} 

class Switch {
    x: number;
    y: number;
    size: number;
    horizontal: boolean;
    active = false;

    constructor (x: number, y: number, size: number, horizontal: boolean) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.horizontal = horizontal;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {

            let realWidth = this.horizontal ? this.size : this.size / 2;
            let realHeight = !this.horizontal ? this.size : this.size / 2;
        
        if (this.active) {
            let offsetX = this.size - realHeight;
            let offsetY = this.size - realWidth;
            ctx.fillStyle = activeColor;
            ctx.fillRect((this.x - realWidth / 2 + offsetX) * multiplier, (this.y - realHeight / 2 + offsetY) * multiplier,
            multiplier * this.size / 2, multiplier * this.size / 2);
        } else {
            ctx.fillStyle = color;
            ctx.fillRect((this.x - realWidth / 2) * multiplier, (this.y - realHeight / 2) * multiplier,
            multiplier * this.size / 2, multiplier * this.size / 2);
        }
        ctx.strokeStyle = color;
        ctx.strokeRect((this.x - realWidth / 2) * multiplier, (this.y - realHeight / 2) * multiplier,
            multiplier * realWidth, multiplier * realHeight);
    }

    collided(mouse: Mouse, multiplier: number) {
        let realWidth = this.horizontal ? this.size : this.size / 2;
        let realHeight = !this.horizontal ? this.size : this.size / 2;
        return (
            (this.x - realWidth / 2) <= mouse.x / multiplier 
            && (this.x + realWidth / 2) >= mouse.x / multiplier 
            && (this.y - realHeight / 2) <= mouse.y / multiplier 
            && (this.y + realHeight / 2) >= mouse.y / multiplier
        );
    }

    switch() {
        this.active = !this.active;
    }
}

class TextButton {
    x: number;
    y: number;
    size: number;
    width: number;
    height: number;
    str: string;
    active = false;

    constructor (x: number, y: number, size: number, width: number, height: number, str: string) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.width = width;
        this.height = height;
        this.str = str;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {

        if (this.active) {
            ctx.fillStyle = activeColor;
        } else {
            ctx.fillStyle = color;
        }
        ctx.font = "bold " + Math.floor(this.size) + "px Consolas";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(this.str, this.x * multiplier, this.y * multiplier, this.width * multiplier);
    }

    collided(mouse: Mouse, multiplier: number) {
        return (
            (this.x - this.width / 2) <= mouse.x / multiplier 
            && (this.x + this.width / 2) >= mouse.x / multiplier 
            && (this.y - this.height / 2) <= mouse.y / multiplier 
            && (this.y + this.height / 2) >= mouse.y / multiplier
        );
    }

    switch() {
        this.active = !this.active;
    }
}

class TextBox {
    x: number;
    y: number;
    width: number;
    height: number;
    str: string = "0";
    active: boolean = false;

    constructor (x: number, y: number, width: number, height: number) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {

        ctx.strokeStyle = color;
        if (this.active) {
            ctx.strokeStyle = activeColor;
        }
        ctx.strokeRect((this.x - this.width / 2) * multiplier, (this.y - this.height / 2) * multiplier,
            multiplier * this.width, multiplier * this.height);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.font = "bold " + Math.floor(this.height * multiplier) + "px Consolas";
        ctx.fillText(this.str, this.x * multiplier, this.y * multiplier + 2);
    }

    handle(mouse: Mouse, keyboard: Keyboard, multiplier: number) {
        if (mouse.wentDown) {
            if (this.collided(mouse, multiplier)) {
                this.active = true;
            } else {
                this.active = false;
            }
        }
        if (this.active) {
            let sign = this.str[0] === "-" ? "-" : "";
            let parts = this.str.split("-");
            let other = parts[parts.length - 1];

            let newStr = keyboard.getString(["0","1","2","3","4","5","6","7","8","9"]);
            other += newStr;

            if (keyboard.wentDown("-")) {
               sign = sign === "-" ? "" : "-";
            }
            if (keyboard.wentDown("Backspace")) {
                other = other.slice(0, other.length - 1);
            }
            
            let num = Number.parseInt(other);
            other = num.toString();
            if (isNaN(num)) {
                other = "0";
            }

            this.str = sign + other;
            if (Number.parseInt(this.str) < -128) {
                this.str = "-128";
            }
            if (Number.parseInt(this.str) > 127) {
                this.str = "127";
            }
        }
    }

    collided(mouse: Mouse, multiplier: number) {
        return (
            (this.x - this.width / 2) <= mouse.x / multiplier 
            && (this.x + this.width / 2) >= mouse.x / multiplier 
            && (this.y - this.height / 2) <= mouse.y / multiplier 
            && (this.y + this.height / 2) >= mouse.y / multiplier
        );
    }
}

export class ComponentInput extends ComponentNode {
    val: Number = 0;

    constructor(type: ComponentType, typeIndex: number, x: number, y: number, name: string, val: Number, 
        outputs = [new OutputNode(x + 1, y + 0.5, name)], func: ComponentFunction = (a) => [this.val]) {
        super(type, typeIndex, x, y, [], outputs, func, false);
        this.val = val;
    }
    
    clone(): ComponentInput {
        let clone = new ComponentInput(this.type, this.typeIndex, 0, 0, "", 0);
        super.cloneNode(clone);
        clone.initialize();
        return clone as ComponentInput;
    }
}

export class ChangeBinaryInput extends ComponentInput {
    switch: Switch;

    constructor(type: ComponentType, typeIndex: number, x: number, y: number, name: string) {
        super(type, typeIndex, x, y, name, 0);
        this.switch = new Switch(x + 0.5, y + 0.5, 0.5, false);
    }

    changePos(divX: number, divY: number): void {
        super.changePos(divX, divY);
        this.switch.x += divX;
        this.switch.y += divY;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        this.switch.draw(ctx, color, activeColor, backColor, multiplier);
    }

    handleChanges(mouse: Mouse, keyboard: Keyboard, multiplier: number) {
        if (mouse.wentDown && this.switch.collided(mouse, multiplier)) {
            this.switch.switch();
            this.val = this.val === 0 ? 1 : 0;
        }
    }

    clone(): ChangeBinaryInput {
        let clone = new ChangeBinaryInput(this.type, this.typeIndex, 0, 0, "");
        super.cloneNode(clone);
        clone.initialize();
        return clone as ChangeBinaryInput;
    }
}

export class Binary2BitInput extends ComponentInput {
    switch1: Switch;
    switch2: Switch;

    constructor(type: ComponentType, typeIndex: number, x: number, y: number, name: string) {
        let output1 = new OutputNode(x + 1, y + 0.25, name + 0);
        let output2 = new OutputNode(x + 1, y + 0.75, name + 1);
        super(type, typeIndex, x, y, name, 0, [output1, output2], (inputs) => [(this.val.valueOf() & (1 << 1)) >> 1, this.val.valueOf() & (1 << 0)]);
        this.switch1 = new Switch(this.x + 0.5, this.y + 0.7, 0.5, true);
        this.switch2 = new Switch(this.x + 0.5, this.y + 0.3, 0.5, true);
    }

    changePos(divX: number, divY: number): void {
        super.changePos(divX, divY);
        this.switch1.x += divX;
        this.switch1.y += divY;
        this.switch2.x += divX;
        this.switch2.y += divY;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        this.switch1.draw(ctx, color, activeColor, backColor, multiplier);
        this.switch2.draw(ctx, color, activeColor, backColor, multiplier);
    }

    handleChanges(mouse: Mouse, keyboard: Keyboard, multiplier: number) {
        if (mouse.wentDown) {
            if (this.switch1.collided(mouse, multiplier)) {
                this.switch1.switch();
                let bit = this.val.valueOf() & (1 << 0);
                this.val = bit ? this.val.valueOf() & ~(1 << 0) : this.val.valueOf() | (1 << 0);
            }
            if (this.switch2.collided(mouse, multiplier)) {
                this.switch2.switch();
                let bit = this.val.valueOf() & (1 << 1);
                this.val = bit ? this.val.valueOf() & ~(1 << 1) : this.val.valueOf() | (1 << 1);
            }
        }
    }

    clone(): ChangeBinaryInput {
        let clone = new ChangeBinaryInput(this.type, this.typeIndex, 0, 0, "");
        super.cloneNode(clone);
        clone.initialize();
        return clone as ChangeBinaryInput;
    }
}

export class Binary8BitInput extends ComponentInput {
    switches: TextButton[] = [];

    constructor(type: ComponentType, typeIndex: number, x: number, y: number, name: string) {
        let outputs: OutputNode[] = [];
        for (let index = 0; index < 8; index ++) {
            outputs.push(new OutputNode(x + 1, y + 0.5 + index, name + index));  
        }
        super(type, typeIndex, x, y, name, 0, outputs, (inputs) => [
            ...Array.from({ length: 8 }, (value, index) => index).map((index) => (this.val.valueOf() & (1 << (this.switches.length - index - 1))) >> (this.switches.length - index - 1))
        ]);
        for (let index = 0; index < 8; index ++) {
            this.switches.push(new TextButton(this.x + 0.5, this.y + 0.5 + index, 30, 0.5, 0.5, Math.pow(2, 7 - index).toString()));
        }
        this.height = 8;
    }

    changePos(divX: number, divY: number): void {
        super.changePos(divX, divY);
        for (let index = 0; index < this.switches.length; index ++) {
            this.switches[index].x += divX;
            this.switches[index].y += divY;
        }
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        for (let index = 0; index < this.switches.length; index ++) {
            this.switches[index].draw(ctx, color, activeColor, backColor, multiplier);
        }
    }

    handleChanges(mouse: Mouse, keyboard: Keyboard, multiplier: number) {
        if (mouse.wentDown) {
            for (let index = 0; index < this.switches.length; index++) {
                let sw = this.switches[index];
                if (sw.collided(mouse, multiplier)) {
                    sw.switch();
                    let neededBitIndex = this.switches.length - index - 1;
                    let bit = this.val.valueOf() & (1 << neededBitIndex);
                    this.val = bit ? this.val.valueOf() & ~(1 << neededBitIndex) : this.val.valueOf() | (1 << neededBitIndex);
                }
            }
        }
    }

    clone(): Binary8BitInput {
        let clone = new Binary8BitInput(this.type, this.typeIndex, 0, 0, "");
        super.cloneNode(clone);
        clone.initialize();
        return clone as Binary8BitInput;
    }
}

export class Binary8BitSubInput extends ComponentInput {
    switches: TextButton[] = [];

    constructor(type: ComponentType, typeIndex: number, x: number, y: number, name: string) {
        let outputs: OutputNode[] = [];
        for (let index = 0; index < 8; index ++) {
            outputs.push(new OutputNode(x + 1, y + 0.5 + index, name + index));  
        }
        super(type, typeIndex, x, y, name, 0, outputs, (inputs) => {
            let outputs = [];
            outputs.push(this.val.valueOf() < 0 ? 1 : 0);
            for (let index = 1; index < 8; index ++) {
                outputs.push((this.val.valueOf() & (1 << (this.switches.length - index - 1))) >> (this.switches.length - index - 1));
            }
            return outputs;
    });
        this.switches.push(new TextButton(this.x + 0.5, this.y + 0.5, 30, 0.5, 0.5, (-Math.pow(2, 7)).toString()));
        for (let index = 1; index < 8; index ++) {
            this.switches.push(new TextButton(this.x + 0.5, this.y + 0.5 + index, 30, 0.5, 0.5, Math.pow(2, 7 - index).toString()));
        }
        this.height = 8;
    }

    changePos(divX: number, divY: number): void {
        super.changePos(divX, divY);
        for (let index = 0; index < this.switches.length; index ++) {
            this.switches[index].x += divX;
            this.switches[index].y += divY;
        }
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        for (let index = 0; index < this.switches.length; index ++) {
            this.switches[index].draw(ctx, color, activeColor, backColor, multiplier);
        }
    }

    handleChanges(mouse: Mouse, keyboard: Keyboard, multiplier: number) {
        if (mouse.wentDown) {
            for (let index = 0; index < this.switches.length; index++) {
                let sw = this.switches[index];
                if (sw.collided(mouse, multiplier)) {
                    let neededBitIndex = this.switches.length - index - 1;
                    let bit = this.val.valueOf() & (1 << neededBitIndex);
                    sw.switch();
                    
                    if (index !== 0) {
                        this.val = bit ? this.val.valueOf() & ~(1 << neededBitIndex) : this.val.valueOf() | (1 << neededBitIndex);
                    } else {
                        this.val = this.val.valueOf() - 128 * (this.val.valueOf() >= 0 ? 1 : -1);
                    }
                }
            }
        }
    }

    clone(): Binary8BitInput {
        let clone = new Binary8BitInput(this.type, this.typeIndex, 0, 0, "");
        super.cloneNode(clone);
        clone.initialize();
        return clone as Binary8BitInput;
    }
}

export class VoltageInput extends ComponentInput {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number, name: string) {
        super(type, typeIndex, x, y, name, 1);
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle"
        ctx.textAlign = "center";
        ctx.font = "bold 30px Consolas";
        ctx.fillText("1", (this.x + 0.5) * multiplier, (this.y + 0.5) * multiplier);
    }

    clone(): VoltageInput {
        let clone = new VoltageInput(this.type, this.typeIndex, 0, 0, "");
        super.cloneNode(clone);
        clone.initialize();
        return clone as VoltageInput;
    }
}

export class NumberInput extends ComponentInput {
    textBox: TextBox;

    constructor(type: ComponentType, typeIndex: number, x: number, y: number, name: string) {
        super(type, typeIndex, x, y, name, 0, [new OutputNode(x + 1, y + 0.5, name, SchemeNodeType.SIGNED)]);
        this.textBox = new TextBox(x + 0.5, y + 0.5, 0.65, 0.3);
    }

    changePos(divX: number, divY: number): void {
        super.changePos(divX, divY);
        this.textBox.x += divX;
        this.textBox.y += divY;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        this.textBox.draw(ctx, color, activeColor, backColor, multiplier);
    }

    handleChanges(mouse: Mouse, keyboard: Keyboard, multiplier: number) {
        this.textBox.handle(mouse, keyboard, multiplier);
        this.val = Number.parseInt(this.textBox.str);
    }

    clone(): ChangeBinaryInput {
        let clone = new ChangeBinaryInput(this.type, this.typeIndex, 0, 0, "");
        super.cloneNode(clone);
        clone.initialize();
        return clone as ChangeBinaryInput;
    }    
}

export class ComponentOutput extends ComponentNode {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number, name: string, 
            inputs = [new InputNode(x, y + 0.5, name, SchemeNodeType.SIGNED)], func: ComponentFunction = (inputs) => [inputs[0]]) {
        super(type, typeIndex, x, y, inputs, [], func, false);
    }

    getValue() {
        return this.func(this.inputNodes.map((input) => input.getValue()))[0];
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle"
        ctx.textAlign = "center";
        ctx.font = "bold 30px Consolas";
        ctx.fillText(this.getValue().toString(), (this.x + this.width / 2) * multiplier, (this.y + this.height / 2) * multiplier);
    }

    clone(): ComponentOutput {
        let clone = new ComponentOutput(this.type, this.typeIndex, 0, 0, "");
        super.cloneNode(clone);
        clone.initialize();
        return clone as ComponentOutput;
    }
}

export class Binary2BitOutput extends ComponentOutput {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number, name: string) {
        let input1 = new InputNode(x, y + 0.75, name + 0);
        let input2 = new InputNode(x, y + 0.25, name + 1);
        super(type, typeIndex, x, y, name, [input1, input2], (inputs) => [inputs[1].valueOf() << 1 | inputs[0].valueOf()]);
    }

    getValue() {
        return this.func(this.inputNodes.map((input) => input.getValue()))[0];
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
    }

    clone(): Binary2BitOutput {
        let clone = new Binary2BitOutput(this.type, this.typeIndex, 0, 0, "");
        super.cloneNode(clone);
        clone.initialize();
        return clone as Binary2BitOutput;
    }
}

export class Binary8BitOutput extends ComponentOutput {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number, name: string) {
        let inputs: InputNode[] = [];
        for (let index = 0; index < 8; index++) {
            inputs.push(new InputNode(x, y + 0.5 + index, name + index))
        }
        super(type, typeIndex, x, y, name, inputs, (inputs) => [inputs.reduce((acc, cur, index) => acc.valueOf() | cur.valueOf() << (inputs.length - index - 1), 0)]);
        this.height = 8;
    }

    getValue() {
        return this.func(this.inputNodes.map((input) => input.getValue()))[0];
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
    }

    clone(): Binary8BitOutput {
        let clone = new Binary8BitOutput(this.type, this.typeIndex, 0, 0, "");
        super.cloneNode(clone);
        clone.initialize();
        return clone as Binary8BitOutput;
    }
}

export class Binary8BitSubOutput extends ComponentOutput {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number, name: string) {
        let inputs: InputNode[] = [];
        for (let index = 0; index < 8; index++) {
            inputs.push(new InputNode(x, y + 0.5 + index, name + index))
        }
        super(type, typeIndex, x, y, name, inputs, (inputs) => {
            let res = 0;
            for (let index = 7; index > 0; index--) {
                res |= inputs[index].valueOf() << (7 - index);
            }
            if (inputs[0].valueOf() === 1) {
                res -= 128;
            }
            return [res];
        });
        this.height = 8;
    }

    getValue() {
        return this.func(this.inputNodes.map((input) => input.getValue()))[0];
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
    }

    clone(): Binary8BitOutput {
        let clone = new Binary8BitOutput(this.type, this.typeIndex, 0, 0, "");
        super.cloneNode(clone);
        clone.initialize();
        return clone as Binary8BitOutput;
    }
}

export class ComponentOffRelay extends ComponentNode {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number) {
        let input1 = new InputNode(x, y + 0.25, "c");
        let input2 = new InputNode(x, y + 0.75, "x");
        let output = new OutputNode(x + 1, y + 0.5, "o");
        super(type, typeIndex, x, y, [input1, input2], [output], (inputs) => [inputs[0] ? inputs[1] : 0]);
    }

    drawBody(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.drawBody(ctx, color, activeColor, backColor, multiplier);
        ctx.strokeStyle = this.inputNodes[1].getValue() !== 0 ? activeColor : color;
        ctx.beginPath();
        ctx.moveTo(this.inputNodes[1].x * multiplier, this.inputNodes[1].y * multiplier);
        if (this.inputNodes[0].getValue() !== 0) {
            ctx.lineTo(this.outputNodes[0].x * multiplier, this.outputNodes[0].y * multiplier)
        } else {
            ctx.lineTo((this.outputNodes[0].x - 0.2) * multiplier, (this.outputNodes[0].y - 0.15) * multiplier)
        }
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = this.inputNodes[0].getValue() !== 0 ? activeColor : color;
        ctx.beginPath();
        ctx.moveTo(this.inputNodes[0].x * multiplier, this.inputNodes[0].y * multiplier);
        ctx.lineTo((this.inputNodes[0].x + 0.5) * multiplier, this.inputNodes[0].y * multiplier);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = backColor;
        ctx.beginPath();
        ctx.arc((this.inputNodes[0].x + 0.5) * multiplier, this.inputNodes[0].y * multiplier, 8, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    clone(): ComponentOffRelay {
        let clone = new ComponentOffRelay(this.type, this.typeIndex, 0, 0);
        super.cloneNode(clone);
        clone.initialize();
        return clone as ComponentOffRelay;
    }
}

export class ComponentOnRelay extends ComponentNode {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number) {
        let input1 = new InputNode(x, y + 0.25, "c");
        let input2 = new InputNode(x, y + 0.75, "x");
        let output = new OutputNode(x + 1, y + 0.5, "o");
        super(type, typeIndex,  x, y, [input1, input2], [output], (inputs) => [!inputs[0] ? inputs[1] : 0]);
    }

    drawBody(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.drawBody(ctx, color, activeColor, backColor, multiplier);
        ctx.strokeStyle = this.inputNodes[1].getValue() !== 0 ? activeColor : color;
        ctx.beginPath();
        ctx.moveTo(this.inputNodes[1].x * multiplier, this.inputNodes[1].y * multiplier);
        if (this.inputNodes[0].getValue() === 0) {
            ctx.lineTo(this.outputNodes[0].x * multiplier, this.outputNodes[0].y * multiplier)
        } else {
            ctx.lineTo((this.outputNodes[0].x - 0.2) * multiplier, (this.outputNodes[0].y - 0.15) * multiplier)
        }
        ctx.closePath();
        ctx.stroke();

        ctx.strokeStyle = this.inputNodes[0].getValue() !== 0 ? activeColor : color;
        ctx.beginPath();
        ctx.moveTo(this.inputNodes[0].x * multiplier, this.inputNodes[0].y * multiplier);
        ctx.lineTo((this.inputNodes[0].x + 0.5) * multiplier, this.inputNodes[0].y * multiplier);
        ctx.closePath();
        ctx.stroke();

        ctx.fillStyle = backColor;
        ctx.beginPath();
        ctx.arc((this.inputNodes[0].x + 0.5) * multiplier, this.inputNodes[0].y * multiplier, 8, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
    }

    clone(): ComponentOnRelay {
        let clone = new ComponentOnRelay(this.type, this.typeIndex, 0, 0);
        super.cloneNode(clone);
        clone.initialize();
        return clone as ComponentOnRelay;
    }
}

export class ComponentNand extends ComponentNode {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number) {
        let input1 = new InputNode(x, y + 0.25, "a", SchemeNodeType.SYNCH);
        let input2 = new InputNode(x, y + 0.75, "b", SchemeNodeType.SYNCH);
        let output = new OutputNode(x + 1, y + 0.5, "x", SchemeNodeType.SYNCH);
        super(type, typeIndex,  x, y, [input1, input2], [output], (inputs) => [~(inputs[0].valueOf() & inputs[1].valueOf())], true, 1);
    }

    clone(): ComponentNand {
        let clone = new ComponentNand(this.type, this.typeIndex, 0, 0);
        super.cloneNode(clone);
        clone.initialize();
        return clone as ComponentNand;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle"
        ctx.textAlign = "center";
        ctx.font = "bold 20px Consolas";
        ctx.fillText("NAND", (this.x + 0.5) * multiplier, (this.y + 0.5) * multiplier);
    }
}

export class ComponentInvert extends ComponentNode {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number) {
        let input = new InputNode(x, y + 0.5, "a", SchemeNodeType.SYNCH);
        let output = new OutputNode(x + 1, y + 0.5, "x", SchemeNodeType.SYNCH);
        super(type, typeIndex,  x, y, [input], [output], (inputs) => [~inputs[0]], true, 1);
    }

    clone(): ComponentInvert {
        let clone = new ComponentInvert(this.type, this.typeIndex, 0, 0);
        super.cloneNode(clone);
        clone.initialize();
        return clone as ComponentInvert;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle"
        ctx.textAlign = "center";
        ctx.font = "bold 20px Consolas";
        ctx.fillText("INV", (this.x + 0.5) * multiplier, (this.y + 0.5) * multiplier);
    } 
}

export class ComponentAnd extends ComponentNode {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number) {
        let input1 = new InputNode(x, y + 0.25, "a", SchemeNodeType.SYNCH);
        let input2 = new InputNode(x, y + 0.75, "b", SchemeNodeType.SYNCH);
        let output = new OutputNode(x + 1, y + 0.5, "x", SchemeNodeType.SYNCH);
        super(type, typeIndex,  x, y, [input1, input2], [output], (inputs) => [inputs[0].valueOf() & inputs[1].valueOf()], true, 2);
    }

    clone(): ComponentAnd {
        let clone = new ComponentAnd(this.type, this.typeIndex, 0, 0);
        super.cloneNode(clone);
        clone.initialize();
        return clone as ComponentAnd;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle"
        ctx.textAlign = "center";
        ctx.font = "bold 20px Consolas";
        ctx.fillText("AND", (this.x + 0.5) * multiplier, (this.y + 0.5) * multiplier);
    } 
}

export class ComponentOr extends ComponentNode {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number) {
        let input1 = new InputNode(x, y + 0.25, "a", SchemeNodeType.SYNCH);
        let input2 = new InputNode(x, y + 0.75, "b", SchemeNodeType.SYNCH);
        let output = new OutputNode(x + 1, y + 0.5, "x", SchemeNodeType.SYNCH);
        super(type, typeIndex,  x, y, [input1, input2], [output], (inputs) => [inputs[0].valueOf() | inputs[1].valueOf()], true, 4);
    }

    clone(): ComponentOr {
        let clone = new ComponentOr(this.type, this.typeIndex, 0, 0);
        super.cloneNode(clone);
        clone.initialize();
        return clone as ComponentOr;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle"
        ctx.textAlign = "center";
        ctx.font = "bold 20px Consolas";
        ctx.fillText("OR", (this.x + 0.5) * multiplier, (this.y + 0.5) * multiplier);
    } 
}

export class ComponentXor extends ComponentNode {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number) {
        let input1 = new InputNode(x, y + 0.25, "a", SchemeNodeType.SYNCH);
        let input2 = new InputNode(x, y + 0.75, "b", SchemeNodeType.SYNCH);
        let output = new OutputNode(x + 1, y + 0.5, "x", SchemeNodeType.SYNCH);
        super(type, typeIndex,  x, y, [input1, input2], [output], (inputs) => [Leave8BitsSigned(inputs[0].valueOf() ^ inputs[1].valueOf())], true, 6);
    }

    clone(): ComponentXor {
        let clone = new ComponentXor(this.type, this.typeIndex, 0, 0);
        super.cloneNode(clone);
        clone.initialize();
        return clone as ComponentXor;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle"
        ctx.textAlign = "center";
        ctx.font = "bold 20px Consolas";
        ctx.fillText("XOR", (this.x + 0.5) * multiplier, (this.y + 0.5) * multiplier);
    } 
}

export class ComponentHalfAdder extends ComponentNode {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number) {
        let input1 = new InputNode(x, y + 0.25, "a");
        let input2 = new InputNode(x, y + 0.75, "b");
        let output1 = new OutputNode(x + 1, y + 0.25, "c");
        let output2 = new OutputNode(x + 1, y + 0.75, "s");
        super(type, typeIndex,  x, y, [input1, input2], [output1, output2], (inputs) => [inputs[0].valueOf() & inputs[1].valueOf() ? 1 : 0, inputs[0].valueOf() ^ inputs[1].valueOf() ? 1 : 0], true, 9);
    }

    clone(): ComponentHalfAdder {
        let clone = new ComponentHalfAdder(this.type, this.typeIndex, 0, 0);
        super.cloneNode(clone);
        clone.initialize();
        return clone as ComponentHalfAdder;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle"
        ctx.textAlign = "center";
        ctx.font = "bold 20px Consolas";
        ctx.fillText("HA", (this.x + 0.5) * multiplier, (this.y + 0.5) * multiplier);
    } 
}

export class ComponentFullAdder extends ComponentNode {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number) {
        let input1 = new InputNode(x, y + 0.25, "a");
        let input2 = new InputNode(x, y + 0.5, "b");
        let input3 = new InputNode(x, y + 0.75, "c");
        let output1 = new OutputNode(x + 1, y + 0.25, "c");
        let output2 = new OutputNode(x + 1, y + 0.75, "s");
        super(type, typeIndex,  x, y, [input1, input2, input3], [output1, output2], (inputs) => {
            let sum = inputs.reduce((acc, cur) => acc.valueOf() + cur.valueOf(), 0);
            return [(sum.valueOf() & (1 << 1)) >> 1, sum.valueOf() & (1 << 0)];
        }, true, 22);
    }

    clone(): ComponentFullAdder {
        let clone = new ComponentAdder(this.type, this.typeIndex, 0, 0);
        super.cloneNode(clone);
        clone.initialize();
        return clone as ComponentAdder;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle"
        ctx.textAlign = "center";
        ctx.font = "bold 20px Consolas";
        ctx.fillText("FA", (this.x + 0.5) * multiplier, (this.y + 0.5) * multiplier);
    } 
}

export class ComponentAdder extends ComponentNode {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number) {
        let input1 = new InputNode(x, y + 0.25, "a", SchemeNodeType.SIGNED);
        let input2 = new InputNode(x, y + 0.75, "b", SchemeNodeType.SIGNED);
        let output = new OutputNode(x + 1, y + 0.5, "s", SchemeNodeType.SIGNED);
        super(type, typeIndex,  x, y, [input1, input2], [output], (inputs) => [Leave8BitsSigned(inputs[0].valueOf() + inputs[1].valueOf())], true, 176);
    }

    clone(): ComponentAdder {
        let clone = new ComponentAdder(this.type, this.typeIndex, 0, 0);
        super.cloneNode(clone);
        clone.initialize();
        return clone as ComponentAdder;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle"
        ctx.textAlign = "center";
        ctx.font = "bold 20px Consolas";
        ctx.fillText("ADD", (this.x + 0.5) * multiplier, (this.y + 0.5) * multiplier);
    }     
}

export class ComponentSubber extends ComponentNode {
    constructor(type: ComponentType, typeIndex: number, x: number, y: number) {
        let input1 = new InputNode(x, y + 0.25, "a", SchemeNodeType.SIGNED);
        let input2 = new InputNode(x, y + 0.75, "b", SchemeNodeType.SIGNED);
        let output = new OutputNode(x + 1, y + 0.5, "s", SchemeNodeType.SIGNED);
        super(type, typeIndex,  x, y, [input1, input2], [output], (inputs) => [Leave8BitsSigned(inputs[0].valueOf() - inputs[1].valueOf())], true, 176);
    }

    clone(): ComponentSubber {
        let clone = new ComponentSubber(this.type, this.typeIndex, 0, 0);
        super.cloneNode(clone);
        clone.initialize();
        return clone as ComponentSubber;
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle"
        ctx.textAlign = "center";
        ctx.font = "bold 20px Consolas";
        ctx.fillText("SUB", (this.x + 0.5) * multiplier, (this.y + 0.5) * multiplier);
    }     
}

export type EasyLink = {
    outputComponent: number;
    outputNumber: number;
    inputComponent: number;
    inputNumber: number;
}

export type EasyComponent = {
    type: ComponentType;
    typeIndex: number;
}

export type Solution = {
    level: string;
    components: EasyComponent[];
    links: EasyLink[];
}

export class LinkAdder {
    inputNode: InputNode | null = null;
    outputNode: OutputNode | null = null;

    draw(ctx: CanvasRenderingContext2D,
        foreColor: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern,
        mouse: Mouse, multiplier: number) {
        if (this.inputNode !== null || this.outputNode !== null) {
            if (this.inputNode !== null) {
                let volatileLink = new SchemeLink(
                    new OutputNode(mouse.x / multiplier, mouse.y / multiplier, "", SchemeNodeType.BINARY, NULL_LINK_FUNCTION),
                    this.inputNode
                );
                volatileLink.draw(ctx, foreColor, activeColor, multiplier);
            } 
            if (this.outputNode !== null) {
                let volatileLink = new SchemeLink(
                    this.outputNode,
                    new InputNode(mouse.x / multiplier, mouse.y / multiplier, "", SchemeNodeType.BINARY, NULL_LINK_FUNCTION)
                );
                volatileLink.draw(ctx, foreColor, activeColor, multiplier);
            }
        }
    }

    handleMouse(scheme: Scheme, mouse: Mouse, multiplier: number) {
        let clicked = false;
        for (let node of scheme.getInputNodes()) {
            if (node.collide(mouse, multiplier) && mouse.wentDown) {
                let res = scheme.getLinksByNode(node);
                clicked = true;
                if (res.length === 0) {
                    this.inputNode = node;
                } else {
                    this.inputNode = null;
                    this.outputNode = res[0].outputNode;
                    scheme.deleteLink(res[0]);
                }
            }
        }
        for (let node of scheme.getOutputNodes()) {
            if (node.collide(mouse, multiplier) && mouse.wentDown) {
                clicked = true;
                this.outputNode = node;
            }
        }
        if (!clicked && mouse.wentDown) {
            this.inputNode = null;
            this.outputNode = null;
        }
    }

    handleLinking(scheme: Scheme) {
        if (this.inputNode !== null && this.outputNode !== null) {
            scheme.addLink(new SchemeLink(this.outputNode, this.inputNode));
            this.inputNode = null;
            this.outputNode = null;
        }
    }
}

export type FaildedTest = {
    testIndex: number;
    outArgs: number[];
}

export class Scheme {
    components: ComponentNode[] = [];
    inComponents: ComponentInput[] = [];
    outComponents: ComponentOutput[] = [];
    links: SchemeLink[] = [];
    linkAdder: LinkAdder = new LinkAdder();
    level: Level | null = null; 

    clear() {
        this.components = [];
        this.inComponents = [];
        this.outComponents = [];
        this.links = [];
        this.linkAdder = new LinkAdder();
        this.level = null;   
    }

    clearValues() {
        this.components.forEach((component) => component.clearValues());
    }

    setLevel(level: Level) {
        this.level = level;
        level.inComponents.forEach((component, index) => {
            this.addInComponent(ComponentGetter(level, ComponentType.IN, index, 3, 1 + index * 2, level.tests.inArgs[index]) as ComponentInput);
        });
        level.outComponents.forEach((component, index) => {
            this.addOutComponent(ComponentGetter(level, ComponentType.OUT, index, 5, 1 + index * 2, level.tests.outArgs[index]) as ComponentOutput);
        });
    }

    addLink(link: SchemeLink) {
        this.links.push(link);
    }

    addComponent(component: ComponentNode) {
        this.components.push(component);
    }

    addInComponent(component: ComponentInput) {
        this.addComponent(component);
        this.inComponents.push(component);
    }

    addOutComponent(component: ComponentOutput) {
        this.addComponent(component);
        this.outComponents.push(component);
    }

    addTypedComponent(component: ComponentNode) {
        switch (component.type) {
            case ComponentType.DROP_BOX: {
                this.addComponent(component);
            } break;
            case ComponentType.IN: {
                this.addInComponent(component as ComponentInput);
            } break;
            case ComponentType.OUT: {
                this.addOutComponent(component as ComponentOutput);
            } break;
        }
    }

    addEasyComponent(level: Level, component: EasyComponent) {
        let newComponent = ComponentGetter(level, component.type, component.typeIndex, 0, 0);
        this.addTypedComponent(newComponent);
    }

    deleteLink(link: SchemeLink) {
        this.deleteLinkIndex(this.links.indexOf(link));
    }
    
    deleteLinkIndex(index: number) {
        this.links[index].destroy();
        this.links.splice(index, 1)
    }

    deleteComponent(component: ComponentNode) {
        this.deleteComponentIndex(this.components.indexOf(component));
    }

    deleteComponentIndex (index: number) {
        let component = this.components[index];
        component.inputNodes.forEach((node) => {
            let res = this.getLinksByNode(node);
            res.forEach((link) => this.deleteLink(link));
        });
        component.outputNodes.forEach((node) => {
            let res = this.getLinksByNode(node);
            res.forEach((link) => this.deleteLink(link));
        });
        this.components.splice(this.components.indexOf(component), 1);
    }

    getInputNodes () {
        let array = [];
        for (let component of this.components) {
            array.push(...component.inputNodes);
        }
        return array;
    }

    getOutputNodes () {
        let array = [];
        for (let component of this.components) {
            array.push(...component.outputNodes);
        }
        return array;
    }

    getLinksByNode (node: SchemeNode) {
        let res = [];
        for (let link of this.links) {
            if (link.inputNode === node || link.outputNode === node) {
                res.push(link);
            }
        }
        return res;
    }

    handleDrag (mouse: Mouse, multiplier: number, leftBorder: number, rightBorder: number, topBorder: number, bottomBorder: number) {
        for (let index = 0; index < this.components.length; index++) {
            let component = this.components[index];
            let drag = component.drag(mouse, multiplier, leftBorder, rightBorder, topBorder, bottomBorder);

            if (drag === 0) {
                this.components.splice(index, 1);
                this.components.unshift(component);
                break;
            }
            if (drag === 1) {
                this.deleteComponentIndex(index);
            }
        }
    }

    handleOther (mouse: Mouse, keyboard: Keyboard, multiplier: number) {
        this.components.forEach((component) => {component.handleChanges(mouse, keyboard, multiplier)});
    }

    draw(ctx: CanvasRenderingContext2D,
        foreColor: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern,
        backColor: string | CanvasGradient | CanvasPattern, multiplier: number) {
        this.links.forEach((link) => {link.draw(ctx, foreColor, activeColor, multiplier)});
            
        for (let index = this.components.length - 1; index >= 0; index--) {
            let component = this.components[index];
            component.draw(ctx, foreColor, activeColor, backColor, multiplier);
        }
    }

    pack(level: Level) {
        let components: EasyComponent[] = [];
        let links: EasyLink[] = [];

        this.components.forEach((component) => {
            let type = ComponentType.DROP_BOX;
            type = this.inComponents.findIndex((comp) => comp === component) === -1 ? type : ComponentType.IN;
            type = this.outComponents.findIndex((comp) => comp === component) === -1 ? type : ComponentType.OUT;
            components.push({typeIndex: component.typeIndex, type: component.type});
        });

        this.components.forEach((component1, index1) => {
            this.components.forEach((component2, index2) => {
                component1.inputNodes.forEach((input, nodeIndex1) => {
                    component2.outputNodes.forEach((output, nodeIndex2) => {
                        let foundLink = this.links.find((link) => link.inputNode === input && link.outputNode === output);
                        if (foundLink) {
                            links.push({
                                inputComponent: index1,
                                inputNumber: nodeIndex1,
                                outputComponent: index2,
                                outputNumber: nodeIndex2
                            });
                        }
                    });
                });
            });
        });

        return {
            components: components,
            links: links,
            level: level.name
        } as Solution;
    }

    static unpack(solution: Solution) {
        let level = levels.find((level) => level.name === solution.level);

        let scheme = new Scheme();
        scheme.level = level!;

        solution.components.forEach((component) => {
            scheme.addEasyComponent(scheme.level!, component);
        });

        solution.links.forEach((link) => {
            scheme.addLink(new SchemeLink(
                scheme.components[link.outputComponent].outputNodes[link.outputNumber],
                scheme.components[link.inputComponent].inputNodes[link.inputNumber]
            ));
        });

        return scheme;
    }

    setInputs(inputs: number[]) {
        for (let index = 0; index < this.inComponents.length; index++) {
            this.inComponents[index].val = inputs[this.inComponents[index].typeIndex];
        }
    }

    getOutputs(): number[] {
        return this.outComponents.sort((c1, c2) => c1.typeIndex - c2.typeIndex).map((component) => component.getValue().valueOf());
    }

    checkOutputs(outputs: number[]) {
        let realOutputs = this.getOutputs();
        return this.outComponents.every((component) => realOutputs[component.typeIndex] === outputs[component.typeIndex]);
    }

    getFailedTests() {
        let failedTests: FaildedTest[] = [];
        this.level?.tests.data.forEach((test, index) => {
            this.clearValues();
            this.setInputs(test.inData);
            if (!this.checkOutputs(test.outData)) {
                failedTests.push({testIndex: index, outArgs: this.getOutputs()});
            }
        });
        return failedTests;
    }

    getComponentCount() {
        return this.components.length - this.inComponents.length - this.outComponents.length;
    }

    getNandCount() {
        return this.components.reduce((acc, cur) => {return acc + cur.nandCount}, 0);
    }
}

export class DropBox {
    dropBox: ComponentNode[] = [];

    setLevel(level: Level) {
        level.components.forEach((component, index) => {
            let newComponent = ComponentGetter(level, ComponentType.DROP_BOX, index, 0.5, 0.5 + index * 1.25);
            this.addComponent(newComponent);
        });
    }

    addComponent(component: ComponentNode) {
        this.dropBox.push(component);
    }

    handleCreation(mouse: Mouse, multiplier: number, scheme: Scheme) {
        this.dropBox.forEach((component) => {
            if (component.collided(mouse.x, mouse.y, multiplier) && mouse.wentDown) {
                scheme.addComponent(component.clone());
            }
        });
    }

    draw(ctx: CanvasRenderingContext2D,
        foreColor: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern,
        backColor: string | CanvasGradient | CanvasPattern, multiplier: number) {
        this.dropBox.forEach((component) => {component.draw(ctx, foreColor, activeColor, backColor, multiplier)})
    }
}