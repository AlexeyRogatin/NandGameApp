import Mouse from "./Mouse";

export let NULL_FUNCTION = () => 0;

export class SchemeNode {
    x: number;
    y: number;
    name: string;
    computeFunction: Function = NULL_FUNCTION;
    value: number = NaN;
    RADIUS = 10;
    WIDTH = 3;
    TRIANGLE = 6;

    constructor(x: number, y: number, name: string, computeFunction: Function = NULL_FUNCTION) {
        this.x = x;
        this.y = y;
        this.name = name;
        this.computeFunction = computeFunction;
    }

    getValue () {
        if (isNaN(this.value)) {
            this.value = this.computeFunction();
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
    constructor(x: number, y: number, name: string, computeFunction: Function = NULL_FUNCTION) {
        super(x, y, name, computeFunction);
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
    }
}

export class InputNode extends SchemeNode {
    constructor(x: number, y: number, name: string, computeFunction: Function = NULL_FUNCTION) {
        super(x, y, name, computeFunction);
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
    }
}

export class SchemeLink {
    inputNode: InputNode;
    outputNode: OutputNode;
    
    constructor(outputNode: OutputNode, inputNode: InputNode) {
        this.inputNode = inputNode;
        this.outputNode = outputNode;
        this.inputNode.computeFunction = this.outputNode.computeFunction;
    }

    destroy () {
        this.inputNode.computeFunction = NULL_FUNCTION;
    }

    getValue () {
        return this.outputNode.computeFunction();
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

export class ComponentNode {
    x: number;
    y: number;
    inputNodes: InputNode[];
    outputNodes: OutputNode[];
    func: Function;
    deletable: boolean;

    constructor(x: number, y: number, inputNodes: InputNode[], outputNodes: OutputNode[], func: Function, deletable = true) {
        this.x = x;
        this.y = y;
        this.outputNodes = outputNodes;
        this.inputNodes = inputNodes;
        this.func = func;
        this.deletable = deletable;
        const realFunc = () => {
            let values = this.inputNodes.map((node) => node.getValue());
            return func(values);
        }
        for (let index = 0; index < this.outputNodes.length; index++) {
            this.outputNodes[index].computeFunction = () => realFunc()[index];
        }
    }

    drawBody(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {
            ctx.lineWidth = 3;
            ctx.strokeStyle = color;
            ctx.fillStyle = backColor;
            ctx.beginPath();
            ctx.roundRect(this.x * multiplier, this.y * multiplier, multiplier, multiplier, 10);
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
            x >= this.x * multiplier && x <= (this.x + 1) * multiplier
            && y >= this.y * multiplier && y <= (this.y + 1) * multiplier 
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
                mouseX = Math.min(rightBorder, Math.max(leftBorder, mouseX));
                mouseY = Math.min(bottomBorder, Math.max(topBorder, mouseY));
            }
            this.changePos(mouseX - mouseRecentX, mouseY - mouseRecentY);
            return 0;
        } else {
            if (this.x < leftBorder - 0.5 || this.x >= rightBorder - 0.5 || this.y < topBorder - 0.5 || this.y >= bottomBorder - 0.5) {
                if (this.deletable) {
                    return 1;
                }
            } else {
                this.changePos(Math.round(this.x) - this.x, Math.round(this.y) - this.y);
            }
        }
    }

    clone (): ComponentNode {
        const clonedComponentNode = new ComponentNode(this.x, this.y, [], [], NULL_FUNCTION);
        this.cloneNode(clonedComponentNode);
        return clonedComponentNode;
    }

    cloneNode (clonedComponentNode: ComponentNode) { 
        clonedComponentNode.x = this.x;
        clonedComponentNode.y = this.y;

        const clonedInputNodes = this.inputNodes.map((inputNode) => {
            return new InputNode(inputNode.x, inputNode.y, inputNode.name, inputNode.computeFunction);
        });
        clonedComponentNode.inputNodes = clonedInputNodes;

        const clonedOutputNodes = this.outputNodes.map((outputNode) => {
            return new OutputNode(outputNode.x, outputNode.y, outputNode.name, outputNode.computeFunction);
        });
        clonedComponentNode.outputNodes = clonedOutputNodes;

        const clonedFunc = this.func;
        clonedComponentNode.func = clonedFunc;

        clonedComponentNode.outputNodes.forEach((outputNode, index) => {
            outputNode.computeFunction = () => {
                const values = clonedComponentNode.inputNodes.map((node) => node.getValue());
                return clonedFunc(values)[index];
            };
        });

        clonedComponentNode.deletable = this.deletable;
    }

    handleChanges (mouse: Mouse, multiplier: Number) {

    }

    clearValues () {
        this.inputNodes.forEach((node) => node.clearValue());
        this.outputNodes.forEach((node) => node.clearValue());
    }
}

export function ComponentGetter(name: string, x: number, y: number, componentName = "") {
    switch (name) {
        case "ChangeBinaryInput": return new ChangeBinaryInput(x, y, componentName);
        case "VoltageInput": return new VoltageInput(x, y, componentName);

        case "Output": return new ComponentOutput(x, y, componentName);

        case "OffRelay": return new ComponentOffRelay(x, y);
        case "OnRelay": return new ComponentOnRelay(x, y);
        case "Nand": return new ComponentNand(x, y);
        default: return new ComponentNode(x, y, [], [], NULL_FUNCTION);
    }
} 

export class ComponentInput extends ComponentNode {
    val: Number = 0;

    constructor(x: number, y: number, name: string, val: Number) {
        let output = new OutputNode(x + 1, y + 0.5, name, () => {});
        super(x, y, [], [output], (a: number[]) => [this.val], false);
        this.val = val;
    }
    
    clone(): ComponentInput {
        let clone = new ComponentInput(0, 0, "", 0);
        super.cloneNode(clone);
        return clone as ComponentInput;
    }
}

export class ChangeBinaryInput extends ComponentInput {
    static SWITCH_SIZE = 0.5

    constructor(x: number, y: number, name: string) {
        let output = new OutputNode(x + 1, y + 0.5, name, () => {});
        super(x, y, name, 0);
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern,
        activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern,
        multiplier: number) {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        if (this.val === 0) {
            ctx.fillStyle = color;
            ctx.fillRect((this.x + 0.5 - ChangeBinaryInput.SWITCH_SIZE / 4) * multiplier, (this.y + 0.5) * multiplier,
            multiplier * ChangeBinaryInput.SWITCH_SIZE / 2, multiplier * ChangeBinaryInput.SWITCH_SIZE / 2);
        } else {
            ctx.fillStyle = activeColor;
            ctx.fillRect((this.x + 0.5 - ChangeBinaryInput.SWITCH_SIZE / 4) * multiplier, (this.y + 0.5 - ChangeBinaryInput.SWITCH_SIZE / 2) * multiplier,
            multiplier * ChangeBinaryInput.SWITCH_SIZE / 2, multiplier * ChangeBinaryInput.SWITCH_SIZE / 2);
        }
        ctx.strokeStyle = color;
        ctx.strokeRect((this.x + 0.5 - ChangeBinaryInput.SWITCH_SIZE / 4) * multiplier, (this.y + 0.5 - ChangeBinaryInput.SWITCH_SIZE / 2) * multiplier,
            multiplier * ChangeBinaryInput.SWITCH_SIZE / 2, multiplier * ChangeBinaryInput.SWITCH_SIZE);
    }

    switchCollided(mouse: Mouse, multiplier: number) {
        return (
            mouse.x / multiplier > this.x + 0.5 - ChangeBinaryInput.SWITCH_SIZE / 4 &&
            mouse.x / multiplier < this.x + 0.5 + ChangeBinaryInput.SWITCH_SIZE / 4 &&
            mouse.y / multiplier > this.y + 0.5 - ChangeBinaryInput.SWITCH_SIZE / 2 &&
            mouse.y / multiplier < this.y + 0.5 + ChangeBinaryInput.SWITCH_SIZE / 2
        );
    }

    handleChanges(mouse: Mouse, multiplier: Number) {
        if (mouse.wentDown && this.switchCollided(mouse, multiplier.valueOf())) {
            this.val = this.val === 0 ? 1 : 0;
        }
    }

    clone(): ChangeBinaryInput {
        let clone = new ChangeBinaryInput(0, 0, "");
        super.cloneNode(clone);
        return clone as ChangeBinaryInput;
    }
}

export class VoltageInput extends ComponentInput {
    constructor(x: number, y: number, name: string) {
        super(x, y, name, 1);
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
        let clone = new VoltageInput(0, 0, "");
        super.cloneNode(clone);
        return clone as VoltageInput;
    }
}

export class ComponentOutput extends ComponentNode {
    val: number = 0;

    constructor(x: number, y: number, name: string) {
        let input = new InputNode(x, y + 0.5, name);
        super(x, y, [input], [], NULL_FUNCTION, false);
        this.func = (inputs: number[]) => {this.val = inputs[0]};
    }

    draw(ctx: CanvasRenderingContext2D, color: string | CanvasGradient | CanvasPattern, activeColor: string | CanvasGradient | CanvasPattern, backColor: string | CanvasGradient | CanvasPattern, multiplier: number): void {
        super.draw(ctx, color, activeColor, backColor, multiplier);
        ctx.fillStyle = color;
        ctx.textBaseline = "middle"
        ctx.textAlign = "center";
        ctx.font = "bold 30px Consolas";
        ctx.fillText(this.inputNodes[0].getValue().toString(), (this.x + 0.5) * multiplier, (this.y + 0.5) * multiplier);
    }

    clone(): ComponentOutput {
        let clone = new ComponentOutput(0, 0, "");
        super.cloneNode(clone);
        return clone as ComponentOutput;
    }
}

export class ComponentOffRelay extends ComponentNode {
    constructor(x: number, y: number) {
        let input1 = new InputNode(x, y + 0.25, "c");
        let input2 = new InputNode(x, y + 0.75, "x");
        let output = new OutputNode(x + 1, y + 0.5, "o");
        super(x, y, [input1, input2], [output], (inputs: number[]) => [inputs[0] ? inputs[1] : 0]);
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
        let clone = new ComponentOffRelay(0, 0);
        super.cloneNode(clone);
        return clone as ComponentOffRelay;
    }
}

export class ComponentOnRelay extends ComponentNode {
    constructor(x: number, y: number) {
        let input1 = new InputNode(x, y + 0.25, "c");
        let input2 = new InputNode(x, y + 0.75, "x");
        let output = new OutputNode(x + 1, y + 0.5, "o");
        super(x, y, [input1, input2], [output], (inputs: number[]) => [!inputs[0] ? inputs[1] : 0]);
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
        let clone = new ComponentOnRelay(0, 0);
        super.cloneNode(clone);
        return clone as ComponentOnRelay;
    }
}

export class ComponentNand extends ComponentNode {
    constructor(x: number, y: number) {
        let input1 = new InputNode(x, y + 0.25, "a", NULL_FUNCTION);
        let input2 = new InputNode(x, y + 0.75, "a", NULL_FUNCTION);
        let output = new OutputNode(x + 1, y + 0.5, "x");
        super(x, y, [input1, input2], [output], (inputs: number[]) => [!(inputs[0] & inputs[1]) ? 1 : 0]);
    }
}