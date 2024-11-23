import { Sprite } from "../class";

interface CreateMapParams {
    ctx: CanvasRenderingContext2D;
    data: number[];
    image: HTMLImageElement;
    mapColums: number;
    columns: number;
    rows: number;
    width: number;
    height: number;
    pixelGap?: number;
}

export function createMap({
    ctx,
    data,
    image,
    mapColums,
    columns,
    rows,
    width,
    height,
    pixelGap = 0
}: CreateMapParams) {
    const result = [];

    for (let ceil = 0; ceil < data.length; ceil++) {
        const col = ceil % mapColums;
        const row = Math.floor(ceil / mapColums);
        let tileNumber = data[ceil];


        result.push(new Sprite({
          ctx,
          image,
          position: {
            x: col * width,
            y: row * height
          },
          frames: {
            col: {
              max: columns
            },
            row: {
              max: rows
            },
            pixelGap
          },
          tileNumber
        }))

      }

    return result;
}