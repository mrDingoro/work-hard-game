interface BoundaryParams {
    ctx: CanvasRenderingContext2D;
    position: {
        x: number;
        y: number;
    };
    width: number;
    height: number;
}

export class Boundary {
    private ctx: CanvasRenderingContext2D;
    public position: {
        x: number;
        y: number;
    };
    public width: number;
    public height: number;

    constructor({
        ctx,
        position,
        width,
        height
    }: BoundaryParams) {
        this.ctx = ctx;
        this.position = position;
        this.width = width;
        this.height = height;
    }

    draw() {
        this.ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.fillRect(this.position.x, this.position.y, this.width, this.height);
    }
}