import { Injectable } from '@angular/core';

@Injectable()
export class WasmService {
  private wasm: typeof import('hypersheets/hypersheets');
  async init() {
    this.wasm = await import('hypersheets/hypersheets');
  }

  start() {
    this.wasm.start();
  }
}