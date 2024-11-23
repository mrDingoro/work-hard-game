export function calculateTileCoordinates({
    tileNumber = 0,
    columns = 16,
    width = 64,
    height = 64,
    pixelGap = 0
  }) {
    const x = (tileNumber % columns) * (width + pixelGap);
    const y = Math.floor(tileNumber / columns) * (height + pixelGap);

    return {x,y}
  }