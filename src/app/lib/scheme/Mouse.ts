export default class Mouse {
    x: number;
    y: number;
    firstX: number;
    firstY: number;
    recentX: number;
    recentY: number;
    velocityX: number;
    velocityY: number;
    isDown: boolean;
    wentDown: boolean;
    wentUp: boolean;
    
    constructor(canvas: HTMLCanvasElement) {
        this.x = 0;
        this.y = 0;
        this.firstX = 0;
        this.firstY = 0;
        this.recentX = 0;
        this.recentY = 0;
        this.velocityX = 0;
        this.velocityY = 0;
        this.isDown = false;
        this.wentDown = false;
        this.wentUp = false;

        canvas.onmousedown = (e: MouseEvent) => e.preventDefault();

        document.onmousemove = (e: MouseEvent) => {
            let rect = canvas.getBoundingClientRect();
            this.x = (e.clientX - rect.left) / rect.width * canvas.width;
            this.y = (e.clientY - rect.top) / rect.height * canvas.height;
        }
    
        document.onmousedown = (e: MouseEvent) => {
            if (e.button === 0 && !this.isDown) {
                this.isDown = true;
                this.wentDown = true;
                this.firstX = this.x;
                this.firstY = this.y;
            }
        }
    
        document.onmouseup = (e: MouseEvent) => {
            if (e.button === 0 && this.isDown) {
                this.isDown = false;
                this.wentUp = true;
                this.firstX = 0;
                this.firstY = 0;
            }
        }
    }

    makeMouseUpdateable = (func: Function) => {
        return () => {
            this.velocityX = this.x - this.recentX;
            this.velocityY = this.y - this.recentY;
            func();
            this.wentDown = false;
            this.wentUp = false;
            this.recentX = this.x;
            this.recentY = this.y;
        }
    }

    draw = (ctx: CanvasRenderingContext2D, radius: number, color: string = "white") => {
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, radius);

        gradient.addColorStop(0, color);
        gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

        ctx.beginPath();
        ctx.arc(this.x, this.y, radius, 0, 2 * Math.PI);
        ctx.fillStyle = gradient;
        ctx.fill();
    }
}