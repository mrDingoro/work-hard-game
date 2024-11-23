import { Animation } from "./Animation";
import { gruntAnimation } from "../animation/Grunt";
import { orgeAnimation } from "../animation/Orge";
import { footmanAnimation } from "../animation/Footman";
import { calculateTileCoordinates } from "../utils/calculateTileCoordinates";
import { CONFIG } from "../constants";

interface UnitParams {
    ctx: CanvasRenderingContext2D;
    image: HTMLImageElement;
    position: {x: number, y: number};
    size: {width: number, height: number};
    offsetSize: {width: number, height: number};
    action?: 'walk' | 'run' | 'attack' | 'idle';
    direction?: 'Up' | 'Right' | 'Down' | 'Left' | 'UpRight' | 'DownRight' | 'UpLeft' | 'DownLeft';
    animateState?: string;
    animationSpeed?: number;
    animation?: {
        columns: number;
        rows: number;
        idle: {frames: number[], loop: number};
        walkUp: {frames: number[], loop: number} | Animation;
        walkRight: {frames: number[], loop: number} | Animation;
        walkDown: {frames: number[], loop: number} | Animation;
        walkLeft: {frames: number[], loop: number} | Animation;
        walkUpRight: {frames: number[], loop: number} | Animation;
        walkDownRight: {frames: number[], loop: number} | Animation;
        walkUpLeft: {frames: number[], loop: number} | Animation;
        walkDownLeft: {frames: number[], loop: number} | Animation;
        attackUp: {frames: number[], loop: number} | Animation;
        attackRight: {frames: number[], loop: number} | Animation;
        attackDown: {frames: number[], loop: number} | Animation;
        attackLeft: {frames: number[], loop: number} | Animation;
        attackUpRight: {frames: number[], loop: number} | Animation;
        attackDownRight: {frames: number[], loop: number} | Animation;
        attackUpLeft: {frames: number[], loop: number} | Animation;
        attackDownLeft: {frames: number[], loop: number} | Animation;
        deathUp: {frames: number[], loop: number} | Animation;
        deathDown: {frames: number[], loop: number} | Animation;
    };
    unitInfo: {
        type: 'player' | 'enemy' | 'ally' | 'neutral';
        animateEntities: 'footman' | 'grunt' | 'orge';
        lifeBar?: boolean;
        currTarget?: Unit | null;
        maxLife?: number;
        currLife?: number;
        walkSpeed?: number;
        runSpeed: number;
        attackSpeed?: number;
        attackFinished?: boolean;
        attackRadius?: number;
        sightRadius?: number;
        heavyDamage?: number;
        lightDamage?: number;
        maxLevel?: number;
        currLevel?: number;
        maxExperience?: number;
        currExperience?: number;
        experienceByDeath?: number;
        isWanderSpawnTile?: boolean;
    }
}


export class Unit {
    private ctx: CanvasRenderingContext2D;
    public image: HTMLImageElement;
    public position: {
        x: number;
        y: number;
    };
    public size: {
        width: number;
        height: number;
    };
    public offsetSize: {
        width: number;
        height: number;
    };
    public direction: 'Up' | 'Right' | 'Down' | 'Left' | 'UpRight' | 'DownRight' | 'UpLeft' | 'DownLeft';
    public animateState?: string;
    public animationSpeed?: number;
    public animation?: {
        columns: number;
        rows: number;
        idle: {frames: number[], loop: number} | Animation;
        walkUp: {frames: number[], loop: number} | Animation;
        walkRight: {frames: number[], loop: number} | Animation;
        walkDown: {frames: number[], loop: number} | Animation;
        walkLeft: {frames: number[], loop: number} | Animation;
        walkUpRight: {frames: number[], loop: number} | Animation;
        walkDownRight: {frames: number[], loop: number} | Animation;
        walkUpLeft: {frames: number[], loop: number} | Animation;
        walkDownLeft: {frames: number[], loop: number} | Animation;
        attackUp: {frames: number[], loop: number} | Animation;
        attackRight: {frames: number[], loop: number} | Animation;
        attackDown: {frames: number[], loop: number} | Animation;
        attackLeft: {frames: number[], loop: number} | Animation;
        attackUpRight: {frames: number[], loop: number} | Animation;
        attackDownRight: {frames: number[], loop: number} | Animation;
        attackUpLeft: {frames: number[], loop: number} | Animation;
        attackDownLeft: {frames: number[], loop: number} | Animation;
        deathUp: {frames: number[], loop: number} | Animation;
        deathDown: {frames: number[], loop: number} | Animation;
    };
    public unitInfo: {
        type: 'player' | 'enemy' | 'ally' | 'neutral';
        animateEntities: 'footman' | 'grunt' | 'orge';
        lifeBar: boolean;
        currTarget: Unit | null;
        maxLife: number;
        currLife: number;
        walkSpeed: number;
        runSpeed: number;
        attackSpeed: number;
        attackFinished: boolean;
        attackRadius: number;
        sightRadius: number;
        heavyDamage: number;
        lightDamage: number;
        maxLevel: number;
        currLevel?: number;
        maxExperience?: number;
        currExperience?: number;
        experienceByDeath?: number;
        isWanderSpawnTile?: boolean;
    }
    public frameWidth: number;
    public frameHeight: number;
    constructor({
        ctx,
        image,
        position,
        size,
        offsetSize,
        direction = 'Down',
        unitInfo = {
            type: "neutral",
            animateEntities: "footman",
            lifeBar: false,
            currTarget: null,
            maxLife: 0,
            currLife: 0,
            walkSpeed: 0.0,
            runSpeed: 0.0,
            attackSpeed: 0,
            attackFinished: false,
            attackRadius: 0,
            sightRadius: 0,
            heavyDamage: 0,
            lightDamage: 0,
            maxLevel: 0,
            currLevel: 0,
            maxExperience: 0,
            currExperience: 0,
            experienceByDeath: 0,
        }
    }: UnitParams) {
        this.ctx = ctx;
        this.image = image;
        this.position = position; // Начальная позиция X Y
        this.size = size;
        this.offsetSize = offsetSize;
        this.direction = direction;
        this.animateState = 'idle'; // Начальное состояние анимации
        this.animationSpeed = 100; // Скорость анимации в миллисекундах
        this.unitInfo = {
            type: unitInfo.type,
            animateEntities: unitInfo.animateEntities,
            lifeBar: unitInfo?.lifeBar || false,
            currTarget: unitInfo.currTarget || null,
            sightRadius: unitInfo.sightRadius || 0,
            attackSpeed: unitInfo.attackSpeed || 0,
            attackFinished: unitInfo.attackFinished || false,
            attackRadius: unitInfo.attackRadius || 0,
            heavyDamage: unitInfo.heavyDamage || 0,
            lightDamage: unitInfo.lightDamage || 0,
            walkSpeed: unitInfo.walkSpeed || 0.0,
            runSpeed: unitInfo.runSpeed || 0.0,
            currLife: unitInfo.currLife || 0,
            maxLife: unitInfo.maxLife || 0,
            maxLevel: unitInfo.maxLevel || 20,
            currLevel: unitInfo.currLevel || 1,
            maxExperience: unitInfo.maxExperience || 100,
            currExperience:unitInfo.currExperience || 0,
            experienceByDeath: unitInfo.experienceByDeath || 0,
            // Блуждающий (только для врагов)
            isWanderSpawnTile: unitInfo.isWanderSpawnTile || false,
        }

        this.animation = this.setUnitAnimation(this.unitInfo.animateEntities);

        this.frameWidth = this.image.width / this.animation.columns;
        this.frameHeight = this.image.height / this.animation.rows;
        // console.log(this.frameWidth, this.frameHeight);
    }

    draw() {
        if (this.animateState && this.animation) {

            const animation = this.animation[this.animateState as keyof typeof this.animation] as Animation;

            if (this.animateState.includes('walk') || this.animateState === 'run') {
                const currSpeed = this.animateState === 'run' ? this.unitInfo.runSpeed : this.unitInfo.walkSpeed;
                this.animateState = `walk${this.direction}`;
                const animation = this.animation[this.animateState as keyof typeof this.animation] as Animation;

                if (this.unitInfo.type === 'enemy') {
                    // console.log(this.animateState, this.direction, animation)
                }

                if (animation instanceof Animation) {
                    animation.start(currSpeed);
                }

            } else if (this.animateState.includes('attack')) {
                this.animateState = `attack${this.direction}`;
                const thisAnimationState = this.animation[this.animateState as keyof typeof this.animation] as Animation;

                if (!thisAnimationState.finished()) {
                    this.unitInfo.attackFinished = false;
                    thisAnimationState.start(this.unitInfo.attackSpeed);
                } else {
                    this.unitInfo.attackFinished = true;
                    thisAnimationState.reset();
                }
            } else if (this.animateState === 'idle') {


                if (animation instanceof Animation) {
                    animation.start(250);
                    animation.random = true;
                }
            } else if (this.animateState === 'deathUp' || this.animateState === 'deathDown') {
                if (animation instanceof Animation) {
                    animation.start(20);
                }
            }


            const thisAnimationState = this.animation[this.animateState as keyof typeof this.animation] as Animation;

            const { x, y } = calculateTileCoordinates({
                tileNumber: (thisAnimationState?.getCurrentFrame() ?? 0) - 1,
                columns: this.animation.columns,
                width: this.frameWidth,
                height: this.frameHeight,
            })

            this.ctx.drawImage(
                this.image,
                x,
                y,
                this.frameWidth,
                this.frameHeight,
                this.position.x,
                this.position.y,
                this.offsetSize.width ? this.offsetSize.width : this.frameWidth,
                this.offsetSize.height ? this.offsetSize.height : this.frameHeight
            );

            if (this.unitInfo.lifeBar !== false) {
                this.drawLifeBar();
            }

            if (CONFIG.DEBUG) {
                // sightRadius
                this.ctx.beginPath();
                this.ctx.arc(
                    this.position.x + ((this.frameWidth + this.size.width) / 2),
                    this.position.y + ((this.frameHeight + this.size.height) / 2),
                    this.unitInfo.sightRadius,
                    0,
                    2 * Math.PI
                );
                this.ctx.strokeStyle = 'white';
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.arc(
                    this.position.x + ((this.frameWidth + this.size.width) / 2),
                    this.position.y + ((this.frameHeight + this.size.height) / 2),
                    this.unitInfo.attackRadius,
                    0,
                    2 * Math.PI
                );
                this.ctx.strokeStyle = 'red';
                this.ctx.stroke();

                this.ctx.beginPath();
                this.ctx.rect(
                    this.position.x + (this.frameWidth / 2),
                    this.position.y + (this.frameHeight / 2),
                    this.size.width,
                    this.size.height
                )
                this.ctx.strokeStyle = 'black';
                this.ctx.stroke();
            }
        }

    }

    setUnitAnimation(type: UnitParams['unitInfo']['animateEntities']) {
        let unitAnimation;
        switch (type) {
            case 'footman':
                unitAnimation = footmanAnimation;
                break;
            case 'grunt':
                unitAnimation = gruntAnimation;
                break;
            case 'orge':
                unitAnimation = orgeAnimation;
                break;
        }

        return {
            columns: unitAnimation.columns,
            rows: unitAnimation.rows,
            idle: new Animation(unitAnimation['idle']),
            walkUp: new Animation(unitAnimation['walkUp']),
            walkDown: new Animation(unitAnimation['walkDown']),
            walkLeft: new Animation(unitAnimation['walkLeft']),
            walkRight: new Animation(unitAnimation['walkRight']),
            walkUpRight: new Animation(unitAnimation['walkUpRight']),
            walkDownRight: new Animation(unitAnimation['walkDownRight']),
            walkUpLeft: new Animation(unitAnimation['walkUpLeft']),
            walkDownLeft: new Animation(unitAnimation['walkDownLeft']),
            attackUp: new Animation(unitAnimation['attackUp']),
            attackDown: new Animation(unitAnimation['attackDown']),
            attackLeft: new Animation(unitAnimation['attackLeft']),
            attackRight: new Animation(unitAnimation['attackRight']),
            attackUpRight: new Animation(unitAnimation['attackUpRight']),
            attackDownRight: new Animation(unitAnimation['attackDownRight']),
            attackUpLeft: new Animation(unitAnimation['attackUpLeft']),
            attackDownLeft: new Animation(unitAnimation['attackDownLeft']),
            deathUp: new Animation(unitAnimation['deathUp']),
            deathDown: new Animation(unitAnimation['deathDown'])
        };

    }

    drawLifeBar() {
        this.ctx.fillStyle = "black";
        this.ctx.fillRect(
            this.position.x + (this.frameWidth / 2),
            this.position.y + Math.floor(this.frameHeight / 3.4),
            54,
            9
        );

        if (this.unitInfo.currLife && this.unitInfo.maxLife ) {
            const hpPercentage = Math.floor((this.unitInfo.currLife * 100) / this.unitInfo.maxLife);

            if (hpPercentage > 75) {
                this.ctx.fillStyle = "darkgreen";
            } else if (hpPercentage > 50) {
                this.ctx.fillStyle = "yellow";
            } else if (hpPercentage > 25) {
                this.ctx.fillStyle = "orange";
            } else {
                this.ctx.fillStyle = "red";
            }

            this.ctx.fillRect(
                this.position.x + 2 + (this.frameWidth / 2),
                this.position.y + 2 + Math.floor(this.frameHeight / 3.4),
                Math.floor((hpPercentage * (54 - 4)) / 100),
                5
            );
        }
    }
}

