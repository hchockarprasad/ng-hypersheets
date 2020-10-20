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

const containerWidth = 560;
const scrollerWidth = 3960;
const containerHeight = 400;
const scrollerHeight = 10000;
const cellWidth = 100;
const cellHeight = 20;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'ng-hypersheets';
  @ViewChild('placeholder') placeholder: ElementRef<HTMLInputElement>;
  @ViewChild('scroller') scroller: ElementRef<HTMLInputElement>;
  @ViewChild('canvas') canvas: ElementRef<HTMLCanvasElement>;
  @ViewChild('scrollerContainer') scrollerContainer: ElementRef<HTMLInputElement>;
  constructor(private wasmService: WasmService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.wasmService.init();
    setTimeout(() => {}, 2000);
  }

  @HostListener('document:keydown.ArrowRight', ['$event']) onArrowRight(e) {
    this.moveRight();
  }

  @HostListener('document:keydown.ArrowLeft', ['$event']) onArrowLeft(e) {
    this.moveLeft();
  }

  @HostListener('document:keydown.ArrowDown', ['$event']) onArrowDown(e) {
    this.moveDown();
  }

  @HostListener('document:keydown.ArrowUp', ['$event']) onArrowUp(e) {
    this.moveTop();
  }

  ngAfterViewInit() {
    this.draw({ idx: 0, offset: 0 }, { idx: 0, offset: 0 });
  }

  moveDown() {
    let jumpValue = 20;
    let phTop = this.placeholder.nativeElement.offsetTop;
    if (phTop <= scrollerHeight - jumpValue - cellHeight) {
      this.placeholder.nativeElement.style.top = phTop + jumpValue + 'px';
      let placeHolderExtent = phTop + jumpValue + cellHeight;

      let scrollerTop = this.scrollerContainer.nativeElement.scrollTop;
      let scrollerExtent = scrollerTop + containerHeight;

      let diff = placeHolderExtent - scrollerExtent + 20;
      if (diff > 0) {
        this.scrollerContainer.nativeElement.scrollTop += diff;
        this.onScrolled();
      }
    }
  }

  moveRight() {
    let jumpValue = 100;
    let phleft = this.placeholder.nativeElement.offsetLeft;
    if (phleft <= scrollerWidth - jumpValue - cellWidth) {
      this.placeholder.nativeElement.style.left = phleft + jumpValue + 'px';
      let placeHolderExtent = phleft + jumpValue + cellWidth;
      let scrollerleft = this.scrollerContainer.nativeElement.scrollLeft;
      let scrollerExtent = scrollerleft + containerWidth;

      let diff = placeHolderExtent - scrollerExtent;
      if (diff > 0) {
        console.log('gg');
        this.scrollerContainer.nativeElement.scrollLeft += diff;
        console.log(this.scrollerContainer.nativeElement.scrollLeft);
        this.onScrolled();
      }
    }
  }

  moveLeft() {
    let jumpValue = 100;
    let phleft = this.placeholder.nativeElement.offsetLeft;
    let res = phleft - jumpValue;
    if (res >= 0) {
      this.placeholder.nativeElement.style.left = res + 'px';
      let placeholderLeft = res;

      let scrollerleft = this.scrollerContainer.nativeElement.scrollLeft;

      let diff = placeholderLeft - scrollerleft;
      if (diff < 0) {
        this.scrollerContainer.nativeElement.scrollLeft += diff;
        this.onScrolled();
      }
    }
  }

  moveTop() {
    let jumpValue = 20;
    let phtop = this.placeholder.nativeElement.offsetTop;
    let res = phtop - jumpValue;
    if (res >= 0) {
      this.placeholder.nativeElement.style.top = res + 'px';
      let placeholderTop = res;

      let scrollTop = this.scrollerContainer.nativeElement.scrollTop;

      let diff = placeholderTop - scrollTop;
      if (diff < 0) {
        this.scrollerContainer.nativeElement.scrollTop += diff;
        this.onScrolled();
      }
    }
  }

  onScrolled() {
    const scrollLeft = this.scrollerContainer.nativeElement.scrollLeft;
    const scrollTop = this.scrollerContainer.nativeElement.scrollTop;
    const row = Math.ceil(scrollTop / cellHeight);
    const col = Math.ceil(scrollLeft / cellWidth);
    const totalRowSize = row * cellHeight;
    const totalColSize = col * cellWidth;
    const firstRow = {
      idx: row,
      offset: totalRowSize - scrollTop,
    };
    const firstCol = {
      idx: col,
      offset: totalColSize - scrollLeft,
    };
    // console.log(firstRow);
    this.draw(firstRow, firstCol);
    // console.log('Scroll Left is' + scrollLeft);
  }

  draw(firstRow, firstCol) {
    let ctx = this.canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, containerWidth + 40, containerHeight);
    let rowOffset = firstRow.offset;
    let colOffset = firstCol.offset + 40;
    let rowidx = firstRow.idx + 1;
    while (rowOffset <= containerHeight) {
      ctx.beginPath();
      ctx.rect(0, rowOffset + 20, 40, 20);
      ctx.stroke();
      ctx.fillText(rowidx, 5, rowOffset + 20 + 15);
      ctx.beginPath();
      ctx.lineWidth = 0.3;
      ctx.strokeStyle = '#000000';
      ctx.moveTo(40, rowOffset);
      ctx.lineTo(containerWidth + 40, rowOffset);
      ctx.stroke();
      rowidx += 1;
      rowOffset += cellHeight;
    }

    let colidx = firstCol.idx + 1;
    console.log(colidx);
    while (colOffset <= containerWidth + 40) {
      ctx.beginPath();
      ctx.rect(colOffset, 0, 100, 20);
      ctx.stroke();
      ctx.fillText(colidx, colOffset + 20 + 15, 15);
      ctx.beginPath();
      ctx.lineWidth = 0.3;
      ctx.strokeStyle = '#000000';
      ctx.moveTo(colOffset, 20);
      ctx.lineTo(colOffset, containerHeight);
      ctx.stroke();
      colidx += 1;
      colOffset += cellWidth;
    }
  }
}
