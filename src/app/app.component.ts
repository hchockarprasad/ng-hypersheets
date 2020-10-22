import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  HostListener,
  OnInit,
  ViewChild,
  AfterViewInit,
} from '@angular/core';
import { WasmService } from './wasm.service';
import { HyperSheet } from 'hypersheets';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'ng-hypersheets';
  @ViewChild('placeholder') placeholder: ElementRef<HTMLInputElement>;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('hScrollContainer') hScroller: ElementRef<HTMLElement>;
  @ViewChild('vScrollContainer') vScroller: ElementRef<HTMLElement>;
  @ViewChild('scrollerContainer') scrollerContainer: ElementRef<HTMLInputElement>;

  sheet: HyperSheet;

  constructor(private wasmService: WasmService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.wasmService.init();
    setTimeout(() => {
      this.sheet = this.wasmService.createHyperSheet(
        this.canvas.nativeElement,
        this.hScroller.nativeElement,
        this.vScroller.nativeElement,
        this.scrollerContainer.nativeElement,
        this.placeholder.nativeElement
      );
    }, 1000);
  }

  @HostListener('document:keydown.ArrowRight', ['$event']) onArrowRight(e) {
    this.sheet.on_right_arrow_keydown(e);
  }

  @HostListener('document:keydown.ArrowLeft', ['$event']) onArrowLeft(e) {
    this.sheet.on_left_arrow_keydown(e);
  }

  @HostListener('document:keydown.ArrowDown', ['$event']) onArrowDown(e) {
    this.sheet.on_down_arrow_keydown(e);
  }

  @HostListener('document:keydown.ArrowUp', ['$event']) onArrowUp(e) {
    this.sheet.on_up_arrow_keydown(e);
  }

  onHScroll(e: Event) {
    this.sheet.on_h_scroll(e);
  }

  onVScroll(e: Event) {
    this.sheet.on_v_scroll(e);
  }

  onClick(e: MouseEvent) {
    this.sheet.on_click(e);
  }
}
