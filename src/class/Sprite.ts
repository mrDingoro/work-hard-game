import { calculateTileCoordinates } from "../utils/calculateTileCoordinates"
import { getRandom } from "../utils/getRandom";

interface SpriteParams {
    ctx: CanvasRenderingContext2D;
    image: HTMLImageElement;
    position: {
        x: number;
        y: number;
    };
    frames?: {
        col: {
            max: number;
            val?: number;
            velosity?: number;
        },
        row: {
            max: number;
            val?: number;
        },
        width?: number;
        height?: number;
        pixelGap: number;
    };
    tileNumber?: number;
    animateTiled?: {
        val: number;
        frames: number[];
        velosity: number;
        random?: boolean;
    };
    width?: number;
    height?: number;
}

export class Sprite {
    private ctx: CanvasRenderingContext2D;
    private defaultWidth?: number;
    private defaultHeight? : number;
    public image: HTMLImageElement;
    public position: {
        x: number;
        y: number;
    };
    public frames: {
        col: {
            max: number;
            val: number;
            velosity: number
        },
        row: {
            max: number;
            val: number;
        },
        width: number;
        height: number;
        pixelGap: number;
        elapsed: number;
    };
    public width: number;
    public height: number;
    public tileNumber?: number;
    public moving: boolean;
    public animateTiled: {
        val: number;
        frames: number[];
        velosity: number;
        elapsed: number;
        random: boolean;
    };

    constructor({
        ctx,
        image,
        position,
        frames = { col: { max: 1, val: 0 }, row: { max: 1, val: 0  }, pixelGap: 0},
        tileNumber,
        animateTiled,
    }: SpriteParams) {
        this.ctx = ctx;
        this.image = image;
        this.position = position;
        this.frames = {
            col: {
                max: (frames.col.max || 1),
                val: (frames.col.val || 0),
                velosity: (frames.col.velosity || 10)
            },
            row: {
                max: (frames.row.max || 1),
                val: (frames.row.val || 0)
            },
            width: (frames.width || 0),
            height: (frames.height || 0),
            pixelGap: (frames.pixelGap || 0),
            elapsed: 0
        };
        this.tileNumber = tileNumber;
        this.moving = false;
        this.animateTiled = {
            val: (animateTiled?.val || 0),
            frames: (animateTiled?.frames || []),
            velosity: (animateTiled?.velosity || 10),
            elapsed: 0,
            random: (animateTiled?.random || false)
        };
        this.defaultWidth = this.frames.width;
        this.defaultHeight = this.frames.height;
        const pixelGapCounter = this.frames.pixelGap !== 0 ? 1 : 0;

        this.width = (image.width - ((this.frames.col.max - pixelGapCounter) * this.frames.pixelGap)) / this.frames.col.max;
        this.height = (image.height - ((this.frames.row.max - pixelGapCounter) * this.frames.pixelGap)) / this.frames.row.max;
    }

    draw() {
        if (this.animateTiled.frames.length > 1) {
            this.drawAnimatedTile();
            return;
        }


        let cropX = this.frames.col.val * (this.width + this.frames.pixelGap);
        let cropY = this.frames.row.val * (this.height + this.frames.pixelGap);

        if (this.tileNumber !== undefined) {
            const { x, y } = calculateTileCoordinates({
                tileNumber: this.tileNumber! - 1,
                columns: this.frames.col.max,
                width: this.width,
                height: this.height,
                pixelGap: this.frames.pixelGap
            })
            cropX = x;
            cropY = y;
        }

        this.ctx.drawImage(
            this.image,
            cropX,
            cropY,
            this.image.width / this.frames.col.max,
            this.image.height / this.frames.row.max,
            this.position.x,
            this.position.y,
            this.defaultWidth ? this.defaultWidth : this.image.width / this.frames.col.max,
            this.defaultHeight ? this.defaultHeight : this.image.height / this.frames.row.max
        );

        if (!this.moving) return;

        if (this.frames.col.max > 1) {
            this.frames.elapsed++
        }

        if (this.frames.elapsed % this.frames.col.velosity === 0) {
            if (this.frames.col.val < this.frames.col.max -1) {
                this.frames.col.val++;
            } else {
                this.frames.col.val = 0;
            }
        }
    }

    drawAnimatedTile() {
        const { x, y } = calculateTileCoordinates({
            tileNumber: this.animateTiled?.frames[this.animateTiled.val]! - 1,
            columns: this.frames.col.max,
            width: this.width,
            height: this.height,
            pixelGap: this.frames.pixelGap
        })



        this.ctx.drawImage(
            this.image,
            x,
            y,
            this.image.width / this.frames.col.max,
            this.image.height / this.frames.row.max,
            this.position.x,
            this.position.y,
            this.defaultWidth ? this.defaultWidth : this.image.width / this.frames.col.max,
            this.defaultHeight ? this.defaultHeight : this.image.height / this.frames.row.max
        );

        if (this.animateTiled.frames.length > 1) {
            this.animateTiled.elapsed++
        }

        if (this.animateTiled.elapsed % this.animateTiled.velosity === 0) {
            if (this.animateTiled.random) {
                this.animateTiled.val = getRandom(0, this.animateTiled.frames.length - 1);
            } else {
                if (this.animateTiled.val < this.animateTiled.frames.length - 1) {
                    this.animateTiled.val++;
                } else {
                    this.animateTiled.val = 0;
                }
            }
        }
    }
};