import { Injectable } from '@angular/core';

@Injectable()
export class WasmService {
  private wasm: typeof import('hypersheets/hypersheets');
  async init() {
    this.wasm = await import('hypersheets/hypersheets');
  }

  createHyperSheet(
    canvas: HTMLCanvasElement,
    hScroller: HTMLElement,
    vScroller: HTMLElement,
    scroller: HTMLElement,
    placeholder: HTMLElement
  ) {
    return new this.wasm.HyperSheet(canvas, hScroller, vScroller, scroller, placeholder);
  }
}
