import { getRandom } from "../utils/getRandom";

interface AnimationParams {
    loop: number;
    frames: number[];
}



export class Animation {
    private loops: number;
    private currentFrame: number;
    private lastFrame: number;
    private frames: number[];
    private speed: number;
    private loop: number;
    private elapsed: number;
    public random: boolean;

    constructor({
      loop,
      frames
    }: AnimationParams) {
      // Инициализация переменных
      this.loops = 0; // Количество циклов
      this.currentFrame = 0; // Текущий кадр
      this.lastFrame = frames.length - 1; // Последний кадр
      this.frames = frames; // Массив кадров
      this.speed = 0; // Скорость анимации
      this.loop = loop; // Флаг для зацикливания
      this.elapsed = 0;
      this.random = false;
    }

    // Получение текущего кадра
    getCurrentFrame(): number | undefined {
        this.elapsed++

        if (this.elapsed % this.speed === 0) {
            this.elapsed = 0;
            if (this.random) {
                this.currentFrame = getRandom(0, this.lastFrame);
            } else {
                this.currentFrame++;

                if (this.currentFrame > this.lastFrame) {
                    this.loops++;
                    this.currentFrame = this.loop ? 0 : this.lastFrame;
                }
            }
        }

      return this.frames[this.currentFrame];
    }

    // Проверка на завершение анимации
    finished(): boolean {
      return this.loops > 0;
    }

    // Сброс анимации
    reset(): void {
        this.loops = 0;
        this.currentFrame = 0;
    }

    // Запуск анимации с заданной скоростью
    start(velocity: number): void {
      this.speed = velocity;
    }

    // Остановка анимации
    stop(): void {
      this.speed = 0;
    }
}
