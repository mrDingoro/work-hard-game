import { Boundary, Sprite } from "../class";

interface RectangleCollisionParams {
     rectangle1: Sprite | {
        position: {
            x: number;
            y: number;
        };
        size: {
            width: number;
            height: number;
        }
    };
    rectangle2: Sprite | Boundary | {
        position: {
            x: number;
            y: number;
        };
        width: number;
        height: number;
    };
}

export function rectangleCollision({
    // rectangle1,
    // rectangle2
}: RectangleCollisionParams) {
    // const rect1X = rectangle1.position.x + (rectangle1.frameWidth / 2);
    // const rect1Y = rectangle1.position.y + (rectangle1.frameHeight / 2);
    // return (
    //     rect1X + rectangle1.size.width > rectangle2.position.x
    //    && rect1X < rectangle2.position.x + rectangle2.width
    //    && rect1Y + rectangle1.size.height > rectangle2.position.y
    //    && rect1Y < rectangle2.position.y + rectangle2.height
    // )

    return false;
}