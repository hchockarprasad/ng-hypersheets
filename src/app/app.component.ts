import { Component, OnInit } from '@angular/core';
import { WasmService } from './wasm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ng-hypersheets';

  constructor(private wasmService: WasmService) {}

  ngOnInit() {
    this.wasmService.init();
    setTimeout(() => {
      this.wasmService.start();
    }, 2000);
  }
}
