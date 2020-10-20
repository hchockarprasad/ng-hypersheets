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
const scrollerWidth = 39960;
const containerHeight = 380;
const scrollerHeight = 1999980;
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
  @ViewChild('hScrollContainer') hScroller: ElementRef<HTMLElement>;
  @ViewChild('vScrollContainer') vScroller: ElementRef<HTMLElement>;
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
    let phDiff = this.placeholder.nativeElement.offsetTop - this.scrollerContainer.nativeElement.scrollTop;
    if (phDiff < 0) {
      this.scrollerContainer.nativeElement.scrollTop += phDiff;
      this.vScroller.nativeElement.scrollTop = this.scrollerContainer.nativeElement.scrollTop;
      this.onScrolled();
      return;
    }
    let jumpValue = 20;
    let phTop = this.placeholder.nativeElement.offsetTop;
    if (phTop <= scrollerHeight - jumpValue - cellHeight) {
      this.placeholder.nativeElement.style.top = phTop + jumpValue + 'px';
      let placeHolderExtent = phTop + jumpValue + cellHeight;

      let scrollerTop = this.scrollerContainer.nativeElement.scrollTop;
      let scrollerExtent = scrollerTop + containerHeight;

      let diff = placeHolderExtent - scrollerExtent;
      if (diff > 0) {
        this.scrollerContainer.nativeElement.scrollTop += diff;
        this.vScroller.nativeElement.scrollTop = this.scrollerContainer.nativeElement.scrollTop;
        this.onScrolled();
      }
    }
  }

  moveRight() {
    let phDiff = this.placeholder.nativeElement.offsetLeft - this.scrollerContainer.nativeElement.scrollLeft;
    if (phDiff < 0) {
      this.scrollerContainer.nativeElement.scrollLeft += phDiff;
      this.hScroller.nativeElement.scrollLeft = this.scrollerContainer.nativeElement.scrollLeft;
      this.onScrolled();
      return;
    }
    if (this.scrollerContainer.nativeElement.scrollLeft !== this.hScroller.nativeElement.scrollLeft) {
      this.hScroller.nativeElement.scrollLeft = this.scrollerContainer.nativeElement.scrollLeft;
      this.onScrolled();
      return;
    }
    let jumpValue = 100;
    let phleft = this.placeholder.nativeElement.offsetLeft;
    if (phleft <= scrollerWidth - jumpValue - cellWidth) {
      this.placeholder.nativeElement.style.left = phleft + jumpValue + 'px';
      let placeHolderExtent = phleft + jumpValue + cellWidth;
      let scrollerleft = this.scrollerContainer.nativeElement.scrollLeft;
      let scrollerExtent = scrollerleft + containerWidth;

      let diff = placeHolderExtent - scrollerExtent;
      if (diff > 0) {
        this.scrollerContainer.nativeElement.scrollLeft += diff;
        this.hScroller.nativeElement.scrollLeft = this.scrollerContainer.nativeElement.scrollLeft;
        this.onScrolled();
      }
    }
  }

  moveLeft() {
    let phDiff = this.placeholder.nativeElement.offsetLeft - this.scrollerContainer.nativeElement.scrollLeft;
    if (phDiff < 0) {
      this.scrollerContainer.nativeElement.scrollLeft += phDiff;
      this.hScroller.nativeElement.scrollLeft = this.scrollerContainer.nativeElement.scrollLeft;
      this.onScrolled();
      return;
    }
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
        this.hScroller.nativeElement.scrollLeft = this.scrollerContainer.nativeElement.scrollLeft;
        this.onScrolled();
      }
    }
  }

  moveTop() {
    let phDiff = this.placeholder.nativeElement.offsetTop - this.scrollerContainer.nativeElement.scrollTop;
    if (phDiff < 0) {
      this.scrollerContainer.nativeElement.scrollTop += phDiff;
      this.vScroller.nativeElement.scrollTop = this.scrollerContainer.nativeElement.scrollTop;
      this.onScrolled();
      return;
    }
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
        this.vScroller.nativeElement.scrollTop = this.scrollerContainer.nativeElement.scrollTop;
        this.onScrolled();
      }
    }
  }

  onHScroll() {
    this.scrollerContainer.nativeElement.scrollLeft = this.hScroller.nativeElement.scrollLeft;
    this.onScrolled();
  }

  onVScroll() {
    this.scrollerContainer.nativeElement.scrollTop = this.vScroller.nativeElement.scrollTop;
    this.onScrolled();
  }

  onScrolled() {
    const scrollLeft = this.scrollerContainer.nativeElement.scrollLeft;
    const scrollTop = this.scrollerContainer.nativeElement.scrollTop;
    const row = Math.floor(scrollTop / cellHeight);
    const col = Math.floor(scrollLeft / cellWidth);
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
    this.draw(firstRow, firstCol);
  }

  draw(firstRow, firstCol) {
    let ctx = this.canvas.nativeElement.getContext('2d');
    ctx.clearRect(0, 0, containerWidth + 40, containerHeight + 20);
    let rowOffset = firstRow.offset;
    ctx.fillStyle = '#000000';
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
    while (colOffset <= containerWidth + 40) {
      ctx.beginPath();
      ctx.rect(colOffset, 0, 100, 20);
      ctx.stroke();
      ctx.fillText(colidx, colOffset + 20 + 20, 15);
      ctx.beginPath();
      ctx.lineWidth = 0.3;
      ctx.strokeStyle = '#000000';
      ctx.moveTo(colOffset, 20);
      ctx.lineTo(colOffset, containerHeight + 20);
      ctx.stroke();
      colidx += 1;
      colOffset += cellWidth;
    }

    ctx.beginPath();
    ctx.fillStyle = '#dbdbdb';
    ctx.fillRect(0, 0, 40, 20);
  }
}
