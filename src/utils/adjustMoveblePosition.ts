import { Sprite } from "../class";

interface AdjustMoveblePositionParams {
    direction: 'x' | 'y';
    moveble: (Sprite | {position: {x: number, y: number}})[];
    cameraOffset: number;
}
export function adjustMoveblePosition({
    direction,
    moveble,
    cameraOffset
}: AdjustMoveblePositionParams) {
    moveble.forEach((sprite) => {
        sprite.position[direction] -= cameraOffset;
    })
}