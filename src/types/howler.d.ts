declare module 'howler' {
  interface HowlOptions {
    src?: string | string[];
    preload?: boolean;
    volume?: number;
    [key: string]: any;
  }

  export class Howl {
    constructor(options: HowlOptions);
    play(): number;
    pause(): void;
    stop(): void;
    mute(state: boolean): Howl;
  }

  export class Howler {
    static mute(state: boolean): void;
    static stop(): void;
    static volume(): number;
    static volume(vol: number): Howler;
  }
}
