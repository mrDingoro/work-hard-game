export function loadSprites(spitesPath: Record<string, string>) {
    return Promise
    .all(Object.values(spitesPath).map(loadImage))
    .then((spites) => Object.fromEntries(
      Object.keys(spitesPath).map((key, index) => [key, spites[index]])
    )) as Promise<Record<string, HTMLImageElement>>;
  }

  function loadImage(src: string) {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = src;
      image.onload = () => resolve(image);
    })
  }