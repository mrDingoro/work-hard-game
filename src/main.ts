import './style.css'
import noNameLandJSON from './assets/NoNameLandFinal.json';
import { loadSprites } from './utils/loadSprites';
import { SPRITES } from './constants';
// import { Boundary } from './class';
import { Sprite } from './class';
import { isPositionValid } from './utils/isPositionValid';
import { adjustMoveblePosition } from './utils/adjustMoveblePosition';
// import { rectangleCollision } from './utils/rectangleCollision';
import { Unit } from './class/Unit';


// const boundaryData = noNameLandJSON.layers[1].data;
const elLvl = document.querySelector('.lvl') as HTMLElement;
const elHp = document.querySelector('.hp') as HTMLElement;
const elExp = document.querySelector('.exp') as HTMLElement;
const elAttack = document.querySelector('.attack') as HTMLElement;
const elAttackSpeed = document.querySelector('.attackSpeed') as HTMLElement;

const BUTTON_KEYS: string[] = [];

async function init() {
  const canvas = document.getElementById('game') as HTMLCanvasElement;

  if (!canvas) {
    throw new Error('Canvas not found');
  };

  const CANVAS_WIDTH = canvas.width;
  const CANVAS_HEIGHT = canvas.height;
  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  const camera = {
    x: 0,
    y: 0
  };
  const sprites = await loadSprites(SPRITES);

  const noNameLand = new Sprite({
    ctx,
    image: sprites.NO_NAME_LAND,
    position: {
      x: 0,
      y: 0
    },
    frames: {
      col: {
        max: 1
      },
      row: {
        max: 1
      },
      pixelGap: 0,
    }
  });

  const noNameLandWater = new Sprite({
    ctx,
    image: sprites.NO_NAME_LAND_WATER,
    position: {
      x: 0,
      y: 0
    },
    frames: {
      col: {
        max: 2
      },
      row: {
        max: 1
      },
      pixelGap: 0,
    },
    animateTiled: {
      val: 0,
      frames: [1, 2],
      velosity: 50,
    }
  });
  const player = new Unit({
    ctx,
    image: sprites.FOOTMAN,
    position: {
      x: 4100 ,
      y: 5800
    },
    size: {
      width: 54,
      height: 54
    },
    offsetSize: {
      width: 120,
      height: 120
    },
    unitInfo: {
      type: 'player',
      animateEntities: 'footman',
      lifeBar: true,
      currTarget: null,
      attackSpeed: 22,
      attackFinished: false,
      maxLife: 250,
      currLife: 250,
      walkSpeed: 15,
      runSpeed: 10,
      attackRadius: 55,
      lightDamage: 45,
      sightRadius: 80,
      maxLevel: 20,
      currLevel: 1,
      maxExperience: 100,
      currExperience: 0,
      heavyDamage: 0
    },
    animateState: 'idle',
  })
  setPlayerInfoPanel();

  const weakGruntInfo = {
    ctx,
    image: sprites.GRUNT,
    size: {
      width: 50,
      height: 60
    },
    offsetSize: {
      width: 140,
      height: 140
    },
    type: 'enemy',
    animateEntities: 'grunt',
    lifeBar: true,
    currTarget: null,
    attackSpeed: 30,
    attackFinished: false,
    maxLife: 250,
    currLife: 250,
    walkSpeed: 20,
    runSpeed: 20,
    attackRadius: 50,
    lightDamage: 25,
    sightRadius: 250,
    animateState: 'idle',
    experienceByDeath: 50
  }

  const averageGruntInfo = {
    ctx,
    image: sprites.GRUNT,
    size: {
      width: 50,
      height: 60
    },
    offsetSize: {
      width: 180,
      height: 180
    },
    type: 'enemy',
    animateEntities: 'grunt',
    lifeBar: true,
    currTarget: null,
    attackSpeed: 30,
    attackFinished: false,
    maxLife: 350,
    currLife: 350,
    walkSpeed: 20,
    runSpeed: 20,
    attackRadius: 50,
    lightDamage: 40,
    sightRadius: 250,
    animateState: 'idle',
    experienceByDeath: 75
  }

  const strongOrgeInfo = {
    ctx,
    image: sprites.ORGE,
    size: {
      width: 54,
      height: 54
    },
    offsetSize: {
      width: 140,
      height: 140
    },
    type: 'enemy',
    animateEntities: 'orge',
    lifeBar: true,
    currTarget: null,
    attackSpeed: 30,
    attackFinished: false,
    maxLife: 500,
    currLife: 500,
    walkSpeed: 20,
    runSpeed: 40,
    attackRadius: 60,
    lightDamage: 50,
    sightRadius: 300,
    animateState: 'idle',
    experienceByDeath: 100
  }

  const weakEnemiesPosition = setEnemiesPosition(noNameLandJSON.layers[2].data);
  const averageEnemiesPosition = setEnemiesPosition(noNameLandJSON.layers[3].data);
  const strongEnemiesPosition = setEnemiesPosition(noNameLandJSON.layers[4].data);

  const weakEnemies = createEnemies(weakEnemiesPosition, weakGruntInfo);
  const averageEnemies = createEnemies(averageEnemiesPosition, averageGruntInfo);
  const strongEnemies = createEnemies(strongEnemiesPosition, strongOrgeInfo);

  let elapsed = 0;
  let lastTimeUpdate = 0;
  // let boundares = createBoundaries(boundaryData);

  const enemies = [...weakEnemies, ...averageEnemies, ...strongEnemies];

  function handleKeyAction(event: KeyboardEvent) {
    if(event.type === "keydown" && !BUTTON_KEYS.includes(event.code)) {
      BUTTON_KEYS.push(event.code);
    }

    if(event.type === "keyup") {
      for(var index = 0; index < BUTTON_KEYS.length; index++) {
        if(BUTTON_KEYS[index] === event.code) {
          BUTTON_KEYS.splice(index, 1);
          break;
        }
      }
    }
  }

  document.addEventListener('keydown', handleKeyAction, false);
  document.addEventListener('keyup', handleKeyAction, false);


  function updateCamera(player: Unit) {
    let halfWidth = CANVAS_WIDTH / 2;
    let halfHeight = CANVAS_HEIGHT / 2;


    camera.x = player.position.x - halfWidth > 0
      ? Math.min(Math.max(0, player.position.x - halfWidth), 100 * 64 - 1450)
      : Math.min(0, player.position.x - halfWidth);

    camera.y = player.position.y - halfHeight > 0
    ? Math.min(Math.max(0, player.position.y - halfHeight), 80 * 64 - 700)
    : Math.min(0, player.position.y - halfHeight);
  }

  function createEnemies(enemies: { x: number; y: number; }[], enemyInfo: any) {
    const result = [];

    for (let i = 0; i < enemies.length; i++) {
      result.push(new Unit({
        ctx: enemyInfo.ctx,
        image: enemyInfo.image,
        position: {
          x: enemies[i].x,
          y: enemies[i].y
        },
        size: {
          width: enemyInfo.size.width,
          height: enemyInfo.size.height
        },
        offsetSize: {
          width: enemyInfo.offsetSize.width,
          height:  enemyInfo.offsetSize.height
        },
        unitInfo: {
          type: 'enemy',
          animateEntities: enemyInfo.animateEntities,
          lifeBar: enemyInfo.lifeBar,
          attackSpeed: enemyInfo.attackSpeed,
          attackFinished: enemyInfo.attackFinished,
          maxLife: enemyInfo.maxLife,
          currLife: enemyInfo.currLife,
          walkSpeed: enemyInfo.walkSpeed,
          runSpeed: enemyInfo.runSpeed,
          attackRadius: enemyInfo.attackRadius,
          sightRadius: enemyInfo.sightRadius,
          lightDamage: enemyInfo.lightDamage,
          experienceByDeath: enemyInfo.experienceByDeath
        },
        animateState: enemyInfo.animateState
      })
      )
    }

    return result;
  }

  function setEnemiesPosition(enemies: number[]) {
    const result = [];
    const loopMap = 2;
    const width = 32 * loopMap;
    const height = 32 * loopMap;
    const mapColums = 80;

    for (let ceil = 0; ceil < enemies.length; ceil++) {
        const col = ceil % mapColums;
        const row = Math.floor(ceil / mapColums);
        if (enemies[ceil] !== 0) {
          result.push({
              x: col * width,
              y: row * height
            }
          )
        }
      }

    return result;
  }
  // function createBoundaries(boundaries: number[]) {
  //   const result = [];
  //   const loopMap = 2;
  //   const width = 32 * loopMap;
  //   const height = 32 * loopMap;
  //   const mapColums = 80;

  //   for (let ceil = 0; ceil < boundaries.length; ceil++) {
  //       const col = ceil % mapColums;
  //       const row = Math.floor(ceil / mapColums);
  //       if (boundaries[ceil] !== 0) {
  //         result.push(new Boundary({
  //           ctx,
  //           position: {
  //             x: col * width,
  //             y: row * height
  //           },
  //           width,
  //           height
  //         }))
  //       }
  //     }

  //   return result;
  // }

  function getDirection(angle: number) {
    const directions = {
      0 : 'Left',
      1 : 'UpLeft',
      2 : 'Up',
      3 : 'UpRight',
      4 : 'Right' ,
      5 : 'DownRight',
      6 : 'Down',
      7 : 'DownLeft',
      8 : 'Left',
    };

    angle = Math.round(angle * (180 / Math.PI) + 180);
    angle = Math.floor((angle + 45 / 2) / 45);
    return directions[angle as keyof typeof directions];
  }

  function levelUp() {
    if (player.unitInfo
      && player.unitInfo?.currLevel !== undefined
      && player.unitInfo.maxExperience !== undefined
      && (player.unitInfo.currLevel < player.unitInfo.maxLevel)
    ) {
      player.unitInfo.currLevel++;

      player.unitInfo.maxExperience += 50;
      player.unitInfo.lightDamage += 7;
      player.unitInfo.maxLife += 25;
      player.unitInfo.currLife = player.unitInfo.maxLife;
      player.unitInfo.attackSpeed -= 1;
      player.unitInfo.currExperience = 0;
    }
  }

  function gainExperience(experience: number): void {
    if (player.unitInfo && player.unitInfo.currExperience !== undefined && player.unitInfo.maxExperience !== undefined) {
      player.unitInfo.currExperience += experience;

      if (player.unitInfo.currExperience >= player.unitInfo.maxExperience) {
        levelUp();
      }
    }
  }
  function setPlayerInfoPanel() {
    if (player.unitInfo !== undefined && player.unitInfo.currLevel) {
      const hpPercentage = Math.floor((player.unitInfo.currLife * 100) / player.unitInfo.maxLife);
      let hpBColor = '';
      let hpColor = '';

      if (hpPercentage > 75) {
        hpBColor = "darkgreen";
        hpColor= "white"
      } else if (hpPercentage > 50) {
        hpBColor = "yellow";
        hpColor= "black"
      } else if (hpPercentage > 25) {
        hpBColor = "orange";
        hpColor= "black"
      } else {
        hpBColor = "red";
        hpColor= "white"
      }

      elHp.style.color = hpColor;
      elHp.style.backgroundColor = hpBColor;
      elHp.innerHTML = `${player.unitInfo.currLife} / ${player.unitInfo.maxLife}`;
      elLvl.innerHTML = `${player.unitInfo.currLevel}`;
      elExp.innerHTML = `${player.unitInfo.currExperience} / ${player.unitInfo.maxExperience}`;
      elAttack.innerHTML = `${player.unitInfo.lightDamage}`;
      elAttackSpeed.innerHTML = `${Math.round(player.unitInfo.attackSpeed - 23 +  (player.unitInfo.currLevel * 2))}`;
    }
  }

  function moveDirections(BUTTON_KEYS: string[]) {
    let direction = 'Up';

    const up = BUTTON_KEYS.includes('ArrowUp') || BUTTON_KEYS.includes('Up');
    const right = BUTTON_KEYS.includes('ArrowRight') || BUTTON_KEYS.includes('Right');
    const down = BUTTON_KEYS.includes('ArrowDown') || BUTTON_KEYS.includes('Down');
    const left = BUTTON_KEYS.includes('ArrowLeft') || BUTTON_KEYS.includes('Left');

    if (up) {
      direction = 'Up';
      if (right) {
        direction = 'UpRight';
      } else if (left) {
        direction = 'UpLeft';
      }
      return direction;
    } else if (down) {
      direction = 'Down';
      if (right) {
        direction = 'DownRight';
      } else if (left) {
        direction = 'DownLeft';
      }
      return direction;
    }

    if (right) {
      direction = 'Right';
    } else if (left) {
      direction = 'Left';
    }

    return direction;
  }

  //отключаю коллизи, пока не разберусь с багом.
  // const currBoundaries = boundares.filter(point => {
  //   const pX = player.position.x + Math.abs(noNameLand.position.x) + (player.frameWidth / 2);
  //   const pY = player.position.y + Math.abs(noNameLand.position.x) + (player.frameWidth / 2);
  //   const distance =
  //   Math.sqrt(Math.pow(point.position.x - pX , 2) +  Math.pow(point.position.y - pY, 2));

  //     return distance <= 100;
  // });

   const moveble = [noNameLand, noNameLandWater, ...enemies];
  function animate(timestamp: number) {

    const deltaTime = timestamp - lastTimeUpdate;
    lastTimeUpdate = timestamp
    let moving = true
    const speed = Math.round(0.1 * deltaTime);


    window.requestAnimationFrame(animate);

    updateCamera(player);

    if (BUTTON_KEYS.length > 0) {
      // console.log(
      //   player.position.x + Math.abs(noNameLand.position.x) + (player.frameWidth / 2),
      //   player.position.y + Math.abs(noNameLand.position.y) + (player.frameWidth / 2)
      // )
      // console.log(currBoundaries)

      if (player.animateState !== 'deathDown' && player.animateState !== 'deathUp') {
        if (BUTTON_KEYS.includes('ArrowDown')) {

          // for (let i = 0; i < currBoundaries.length; i++) {

          //   const boundary = boundares[i];
          //   if (rectangleCollision({
          //     rectangle1: {
          //       ...player,
          //       position: {
          //         x: player.position.x + Math.abs(noNameLand.position.x),
          //         y: player.position.y + Math.abs(noNameLand.position.y)
          //       }
          //     },
          //     rectangle2: {
          //       ...boundary,
          //       position: {
          //         x: boundary.position.x,
          //         y: boundary.position.y - speed
          //       }
          //     }
          //   })) {
          //     moving = false;
          //     break;
          //   }
          // }

          if (moving) {
            player.position.y += speed;
          }
        }

        if (BUTTON_KEYS.includes('ArrowLeft')) {
          // for (let i = 0; i < currBoundaries.length; i++) {
          //   const boundary = boundares[i];
          //   if (rectangleCollision({
          //     rectangle1: {
          //       ...player,
          //       position: {
          //         x: player.position.x + Math.abs(noNameLand.position.x),
          //         y: player.position.y + Math.abs(noNameLand.position.y)
          //       }
          //     },
          //     rectangle2: {
          //       ...boundary,
          //       position: {
          //         x: boundary.position.x + speed,
          //         y: boundary.position.y
          //       }
          //     }
          //   })) {
          //     moving = false;
          //     break;
          //   }
          // }

          if (moving) {
            player.position.x -= speed;
          }
        }

        if (BUTTON_KEYS.includes('ArrowRight')) {
          // for (let i = 0; i < currBoundaries.length; i++) {
          //   const boundary = boundares[i];

          //   if (rectangleCollision({
          //     rectangle1: {
          //       ...player,
          //       position: {
          //         x: player.position.x + Math.abs(noNameLand.position.x),
          //         y: player.position.y + Math.abs(noNameLand.position.y)
          //       }
          //     },
          //     rectangle2: {
          //       ...boundary,
          //       position: {
          //         x: boundary.position.x - speed,
          //         y: boundary.position.y
          //       }
          //     }
          //   })) {
          //     moving = false;
          //     break;
          //   }
          // }

          if (moving) {
            player.position.x += speed;
          }
        }

        if (BUTTON_KEYS.includes('ArrowUp')) {
          // for (let i = 0; i < currBoundaries.length; i++) {
          //   const boundary = boundares[i];

          //   if (rectangleCollision({
          //     rectangle1: {
          //       ...player,
          //       position: {
          //         x: player.position.x + Math.abs(noNameLand.position.x),
          //         y: player.position.y + Math.abs(noNameLand.position.y)
          //       }
          //     },
          //     rectangle2: {
          //       ...boundary,
          //       position: {
          //         x: boundary.position.x,
          //         y: boundary.position.y + speed
          //       }
          //     }
          //   })) {
          //     moving = false;
          //     break;
          //   }
          // }

          if (moving) {
            player.position.y -= speed;
          }
        }
      }
    }


    enemies.forEach((enemy) => {
      enemy.animateState = enemy.animateState ?? 'idle';
    })


    if (player.animateState !== 'deathDown' && player.animateState !== 'deathUp') {
          setPlayerInfoPanel();
          player.animateState = 'idle';
          if (BUTTON_KEYS.length > 0) {
            player.animateState = 'walk';
            if (BUTTON_KEYS.includes('ShiftLeft') || BUTTON_KEYS.includes('ShiftRight')) {
              player.animateState = 'run';
            }
          }


          player.direction = moveDirections(BUTTON_KEYS) as "Up" | "Right" | "Down" | "Left" | "UpRight" | "DownRight" | "UpLeft" | "DownLeft";

          if (elapsed % speed === 0) {
            elapsed = 0;
            for (const enemy of enemies) {
              if (enemy.animateState === 'deathUp' || enemy.animateState === 'deathDown') {
                continue;
              }

              const dx = player.position.x - enemy.position.x ;
              const dy = player.position.y - enemy.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy); // Скорость движения

              if (distance <= player.unitInfo.attackRadius) {
                let currEnemy = player.unitInfo.currTarget;

                if (player.unitInfo.currTarget === null) {
                  player.unitInfo.currTarget = enemy
                  currEnemy = player.unitInfo.currTarget;
                }

                if (currEnemy !== null) {
                  const angle = Math.atan2(currEnemy.position.y - player.position.y, currEnemy.position.x - player.position.x);

                  player.direction = getDirection(angle) as "Left" | "UpLeft" | "Up" | "UpRight" | "Right" | "DownRight" | "Down" | "DownLeft";
                  player.animateState = 'attack';

                  if (currEnemy.unitInfo.currLife > 0) {
                    if (player.unitInfo.attackFinished) {
                      currEnemy.unitInfo.currLife -= player.unitInfo.lightDamage;
                    }
                  } else {
                    currEnemy.animateState = 'deathUp';

                    if (currEnemy.unitInfo.experienceByDeath) {
                      gainExperience(currEnemy.unitInfo.experienceByDeath);
                    }

                    currEnemy.unitInfo.lifeBar = false;
                    player.unitInfo.currTarget = null;
                    player.animateState = 'idle';
                  }
                }
              }

              const angle = Math.atan2(player.position.y - enemy.position.y, player.position.x - enemy.position.x);

              if (enemy.animateState !== 'deathUp' && enemy.animateState !== 'deathDown') {
                enemy.animateState = 'idle';

                if (distance <= + enemy.unitInfo.attackRadius) {
                  enemy.direction = getDirection(angle) as "Left" | "UpLeft" | "Up" | "UpRight" | "Right" | "DownRight" | "Down" | "DownLeft";
                  enemy.animateState = 'attack';

                  if (player.unitInfo.currLife >= 0) {
                    if (enemy.unitInfo.attackFinished) {
                      player.unitInfo.currLife -= enemy.unitInfo.lightDamage;
                    }
                  } else {
                    player.animateState = 'deathUp';
                    player.unitInfo.lifeBar = false;
                    player.unitInfo.currTarget = null;
                    enemy.animateState = 'idle';
                  }
                } else if (distance < enemy.unitInfo.sightRadius) {
                  enemy.direction = getDirection(angle) as "Left" | "UpLeft" | "Up" | "UpRight" | "Right" | "DownRight" | "Down" | "DownLeft";
                  enemy.animateState = 'walk';
                  enemy.position.x += dx / distance * speed;
                  enemy.position.y += dy / distance * speed;
                }
              }
            }
          }
    }

    const isXValid = isPositionValid({
      mapCoordinate: noNameLand.position.x,
      playerCoordinate: player.position.x,
      canvasSize: CANVAS_WIDTH,
      maxSize: noNameLand.width
    })

    const isYValid = isPositionValid({
      mapCoordinate: noNameLand.position.y,
      playerCoordinate: player.position.y,
      canvasSize: CANVAS_HEIGHT,
      maxSize: noNameLand.height
    })

    // console.log(isXValid, isYValid)

    // const moveble = [...currBoundaries, noNameLand, noNameLandWater, ...enemies]
    if (!isXValid){
      player.position.x -= camera.x;
      adjustMoveblePosition({
        direction: 'x',
        moveble,
        cameraOffset: camera.x
      })
    }

    if (!isYValid){
      player.position.y -= camera.y;
      adjustMoveblePosition({
        direction: 'y',
        moveble,
        cameraOffset: camera.y
      })
    }

    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    noNameLand.draw();
    noNameLandWater.draw();

    enemies.sort((a, b) => {
      if (a.unitInfo.currLife <= 0 && b.unitInfo.currLife > 0) {
        return -1;
      } else if (a.unitInfo.currLife > 0 && b.unitInfo.currLife <= 0) {
        return 1;
      }

      if (a === player.unitInfo.currTarget || b === player.unitInfo.currTarget) {
        return 1;
      }

      return a.unitInfo.currLife - b.unitInfo.currLife;
    });

    enemies.forEach((enemy) => {
      enemy.draw();
    })

    player.draw();

    // currBoundaries.forEach((sprite) => {
    //   sprite.draw();
    // });
  }

  animate(lastTimeUpdate);
}


init();


