"use client";

import Keyboard from "@/lib/canvas/Keyboard";
import Mouse from "@/lib/canvas/Mouse";
import { DropBox, Scheme } from "@/lib/schemeworks/Components";
import { Level } from "@/lib/schemeworks/levels";
import { useEffect, useRef } from "react";

export type EasyLink = {
  outputComponent: number;
  outputNumber: number;
  inputComponent: number;
  inputNumber: number;
};

export type Solution = {
  components: string[];
  links: EasyLink[];
};

export default function LevelCanvas({
  level,
  setScheme,
}: {
  level: Level;
  setScheme: (s: Scheme) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    //canvas characteristics
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

    //mouse object
    let mouse = new Mouse(canvas);

    //keyboard object
    let keyboard = new Keyboard();

    //dropbox / component shop
    let dropBox = new DropBox();
    let scheme = new Scheme();
    setScheme(scheme);

    //level initialization
    dropBox.setLevel(level);
    scheme.setLevel(level);

    const drawGrid = (
      colorPrime: string | CanvasGradient | CanvasPattern,
      colorAlt: string | CanvasGradient | CanvasPattern,
      size: number,
      div: number,
      startFromX: number
    ) => {
      ctx.lineWidth = 1;
      for (let yIndex = 1; yIndex < (canvas.height / size) * div; yIndex++) {
        ctx.strokeStyle = colorPrime;
        if (yIndex % div !== 0) {
          ctx.strokeStyle = colorAlt;
        }
        ctx.beginPath();
        ctx.moveTo(startFromX * size, (yIndex * size) / div);
        ctx.lineTo(canvas.width, (yIndex * size) / div);
        ctx.closePath();
        ctx.stroke();
      }
      for (
        let xIndex = startFromX * div;
        xIndex < (canvas.width / size) * div;
        xIndex++
      ) {
        ctx.strokeStyle = colorPrime;
        if (xIndex % div !== 0) {
          ctx.strokeStyle = colorAlt;
        }
        ctx.beginPath();
        ctx.moveTo((xIndex * size) / div, 0);
        ctx.lineTo((xIndex * size) / div, canvas.height);
        ctx.closePath();
        ctx.stroke();
      }
    };

    const makeStopable = (func: () => void) => {
      let running = true;

      return [
        function () {
          if (running) {
            func();
          }
        },
        () => {
          running = false;
        },
      ];
    };

    const [loop, stop] = makeStopable(
      keyboard.makeKeyboardUpdateable(
        mouse.makeMouseUpdateable(() => {
          //colors
          const canvasStyle = window.getComputedStyle(canvas);
          const foreColor = canvasStyle.getPropertyValue("--foreground-rgb");
          const backColor = canvasStyle.getPropertyValue(
            "--background-start-rgb"
          );
          const backAltColor = canvasStyle.getPropertyValue(
            "--background-end-rgb"
          );
          const backBrightAltColor = canvasStyle.getPropertyValue(
            "--background-end2-rgb"
          );
          const activeColor = "blue";

          //grid units
          const SIZE =
            Math.round(canvas.width / HOR_COUNT / ROUNDED_VAL) * ROUNDED_VAL;
          canvas.height = SIZE * VER_COUNT;

          //clear rect
          ctx.fillStyle = backColor;
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // //clear values cycle
          // scheme.clearValues();
          scheme.clearValues();

          //create links cycle
          scheme.linkAdder.handleMouse(scheme, mouse, SIZE);
          scheme.linkAdder.handleLinking(scheme);

          //creation cycle
          dropBox.handleCreation(mouse, SIZE, scheme);

          //drag cycle
          scheme.handleDrag(
            mouse,
            SIZE,
            DROP_BOX_SIZE,
            HOR_COUNT,
            0,
            VER_COUNT
          );

          //handling cycle
          scheme.handleOther(mouse, keyboard, SIZE);

          //draw cycle
          drawGrid(backBrightAltColor, backAltColor, SIZE, DIV, DROP_BOX_SIZE);
          dropBox.draw(ctx, foreColor, activeColor, backColor, SIZE);
          scheme.linkAdder.draw(
            ctx,
            foreColor,
            activeColor,
            backColor,
            mouse,
            SIZE
          );
          scheme.draw(ctx, foreColor, activeColor, backColor, SIZE);
          //mouse.draw(ctx, 50, foreColor.replace(")",", 0.25)"));

          requestAnimationFrame(loop);
        })
      )
    );

    requestAnimationFrame(loop);

    return () => {
      stop();
    };
  }, [level, setScheme]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      onContextMenu={(e) => e.preventDefault()}
    />
  );
}
