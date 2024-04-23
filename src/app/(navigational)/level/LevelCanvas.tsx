"use client"

import { Level } from "@/app/lib/levels";
import { useEffect, useRef } from "react";
import { ComponentGetter, ComponentInput, ComponentNode, ComponentOutput, InputNode, NULL_FUNCTION, OutputNode, SchemeLink, SchemeNode } from "./Components";
import createMouse from "./Mouse";
import Mouse from "./Mouse";
import Link from "next/link";
import { Sign } from "crypto";

export default function LevelCanvas({level}: {level: Level}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current!;
        const ctx = canvasRef.current!.getContext("2d")!;
        canvas.width = 1600;
        canvas.height = 1000;

        const ROUNDED_VAL = 20;
        const DIV = 4;
        const HOR_COUNT = 20;
        const DROP_BOX_SIZE = 2;
        const REAL_HOR_COUNT = HOR_COUNT - DROP_BOX_SIZE;
        const VER_COUNT = 10;

        let mouse = new Mouse(canvas);

        let dropBox: ComponentNode[] = [];
        level.components.forEach((component, index) => {dropBox.push(ComponentGetter(component, 0.5, 0.5 + index * 1.25))});

        let components: ComponentNode[] = [];
        level.inComponents.forEach((component, index) => {components.push(ComponentGetter(component, 3, 1 + index * 2, level.tests.inArgs[index]))});
        level.outComponents.forEach((component, index) => {components.push(ComponentGetter(component, HOR_COUNT - 2, 1 + index * 2, level.tests.outArgs[index]))});

        let links: SchemeLink[] = [];

        let inputNode: InputNode | null = null;
        let outputNode: OutputNode | null = null;

        const deleteLink = (index: number) => {
            links[index].destroy();
            links.splice(index, 1)
        }

        const deleteComponent = (index: number) => {
            let component = components[index];
            component.inputNodes.forEach((node) => {
                let res = getLinksByNode(node);
                res.forEach((link) => deleteLink(links.indexOf(link)));
            });
            component.outputNodes.forEach((node) => {
                let res = getLinksByNode(node);
                res.forEach((link) => deleteLink(links.indexOf(link)));
            });
            components.splice(components.indexOf(component), 1);
        }

        const drawGrid = (colorPrime: string | CanvasGradient | CanvasPattern, colorAlt: string | CanvasGradient | CanvasPattern,
            size: number, div: number, startFromX: number) => {
            ctx.lineWidth = 1;
            for (let yIndex = 1; yIndex < canvas.height / size * div; yIndex++) {
                ctx.strokeStyle = colorPrime;
                if (yIndex % div !== 0) {
                    ctx.strokeStyle = colorAlt;
                }
                ctx.beginPath();
                ctx.moveTo(startFromX * size, yIndex * size / div);
                ctx.lineTo(canvas.width, yIndex * size / div);
                ctx.closePath();
                ctx.stroke();
            }
            for (let xIndex = startFromX * div; xIndex < canvas.width / size * div; xIndex++) {
                ctx.strokeStyle = colorPrime;
                if (xIndex % div !== 0) {
                    ctx.strokeStyle = colorAlt;
                }
                ctx.beginPath();
                ctx.moveTo(xIndex * size / div, 0);
                ctx.lineTo(xIndex * size / div, canvas.height);
                ctx.closePath();
                ctx.stroke();
            }
            
        }

        const getInputNodes = () => {
            let array = [];
            for (let component of components) {
                array.push(...component.inputNodes);
            }
            return array;
        }

        const getOutputNodes = () => {
            let array = [];
            for (let component of components) {
                array.push(...component.outputNodes);
            }
            return array;
        }

        const getLinksByNode = (node: SchemeNode) => {
            let res = [];
            for (let link of links) {
                if (link.inputNode === node || link.outputNode === node) {
                    res.push(link);
                }
            }
            return res;
        }

        const loop = mouse.makeMouseUpdateable(() => {
            //colors
            const canvasStyle = window.getComputedStyle(canvas);
            const foreColor = canvasStyle.getPropertyValue("--foreground-rgb");
            const backColor = canvasStyle.getPropertyValue("--background-start-rgb");
            const backAltColor = canvasStyle.getPropertyValue("--background-end-rgb");
            const backBrightAltColor = canvasStyle.getPropertyValue("--background-end2-rgb");
            const activeColor = "blue";

            //grid units
            const SIZE = Math.round(canvas.width / HOR_COUNT / ROUNDED_VAL) * ROUNDED_VAL;
            canvas.height = SIZE * VER_COUNT;

            //clear rect
            ctx.fillStyle = backColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            //clear values cycle
            components.forEach((component) => component.clearValues());

            //create links cycle
            let clicked = false;
            for (let node of getInputNodes()) {
                if (node.collide(mouse, SIZE) && mouse.wentDown) {
                    let res = getLinksByNode(node);
                    clicked = true;
                    if (res.length === 0) {
                        inputNode = node;
                    } else {
                        inputNode = null;
                        outputNode = res[0].outputNode;
                        let index = links.indexOf(res[0]);
                        deleteLink(index);
                    }
                }
            }
            for (let node of getOutputNodes()) {
                if (node.collide(mouse, SIZE) && mouse.wentDown) {
                    clicked = true;
                    outputNode = node;
                }
            }
            if (!clicked && mouse.wentDown) {
                inputNode = null;
                outputNode = null;
            }
            if (inputNode !== null && outputNode !== null) {
                links.push(new SchemeLink(outputNode, inputNode));
                inputNode = null;
                outputNode = null;
            }

            //creation cycle
            for (let component of dropBox) {
                if (component.collided(mouse.x, mouse.y, SIZE) && mouse.wentDown) {
                    components.push(component.clone());
                }
            }
            
            //drag cycle
            for (let index = 0; index < components.length; index++) {
                let component = components[index];
                let drag = component.drag(mouse, SIZE, DROP_BOX_SIZE, HOR_COUNT, 0, VER_COUNT);
                if (drag === 0) {
                    components.splice(index, 1);
                    components.unshift(component);
                    break;
                }
                if (drag === 1) {
                    deleteComponent(index);
                }
            }

            //handling cycle
            components.forEach((component) => {component.handleChanges(mouse, SIZE)});

            //draw cycle
            drawGrid(backBrightAltColor, backAltColor, SIZE, DIV, DROP_BOX_SIZE);
            links.forEach((link) => {link.draw(ctx, foreColor, activeColor, SIZE)});
            if (inputNode !== null || outputNode !== null) {
                if (inputNode !== null) {
                    new SchemeLink(new SchemeNode(mouse.x / SIZE, mouse.y / SIZE, "", NULL_FUNCTION), inputNode).draw(ctx, foreColor, activeColor, SIZE);
                } 
                if (outputNode !== null) {
                    new SchemeLink(outputNode, new SchemeNode(mouse.x / SIZE, mouse.y / SIZE, "", NULL_FUNCTION)).draw(ctx, foreColor, activeColor, SIZE);
                }
            }
            dropBox.forEach((component) => {component.draw(ctx, foreColor, activeColor, backColor, SIZE)})
            for (let index = components.length - 1; index >= 0; index--) {
                let component = components[index];
                component.draw(ctx, foreColor, activeColor, backColor, SIZE);
            }
            mouse.draw(ctx, 50, foreColor.replace(")",", 0.25)"));

            requestAnimationFrame(loop);
        });

        requestAnimationFrame(loop);
    }, []);

    return <canvas ref={canvasRef} className="w-full h-full" onContextMenu={(e) => e.preventDefault()}/>;
}