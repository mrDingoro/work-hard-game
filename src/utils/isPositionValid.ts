interface PositionValidParams {
    mapCoordinate: number;
    playerCoordinate: number;
    canvasSize: number;
    maxSize: number;
}
export function isPositionValid({
    mapCoordinate,
    playerCoordinate,
    canvasSize,
    maxSize
}: PositionValidParams) {
    return mapCoordinate >= 0 && playerCoordinate <= (canvasSize / 2)
        || canvasSize + Math.abs(mapCoordinate) >= maxSize && playerCoordinate >= (canvasSize / 2);
}