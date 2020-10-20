import { asNativeElements, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { kMaxLength } from 'buffer';
import { WasmService } from './wasm.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ng-hypersheets';
  @ViewChild('placeholder') placeholder: ElementRef<HTMLInputElement>;
  @ViewChild('scroller') scroller: ElementRef<HTMLInputElement>;
  @ViewChild('scrollerContainer') scrollerContainer: ElementRef<HTMLInputElement>;
  constructor(private wasmService: WasmService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    this.wasmService.init();
    setTimeout(() => {
      // this.wasmService.start();
    }, 2000);
    // this.scroller = document.getElementById('scroller');
    // this.placeholder = document.getElementById('placeholder');
  }

  @HostListener('contextmenu', ['$event']) onContextMenu(e) {
    e.preventDefault();
    e.stopPropagation();
    this.moveLeft();
  }

  @HostListener('click', ['$event']) onClickEvent(e) {
    this.moveRight();
  }
  
  moveRight() {
    let jumpValue = 50;
    let phleft = this.placeholder.nativeElement.style.left;
    let phvalue = (phleft) ? parseFloat(phleft.replace("px", "")) : 0;
    this.placeholder.nativeElement.style.left = (phvalue + jumpValue) + "px";
    let placeHolderExtent = phvalue + jumpValue + 100;

    let scrollerleft = this.scrollerContainer.nativeElement.scrollLeft;
    let scrollerExtent = scrollerleft + 600;

    let diff = placeHolderExtent - scrollerExtent;
    if (diff > 0) {
      this.scrollerContainer.nativeElement.scrollLeft += diff;
    }
  }

  moveLeft() {
    let jumpValue = 50;
    let phleft = this.placeholder.nativeElement.style.left;
    let phvalue = (phleft) ? parseFloat(phleft.replace("px", "")) : 0;
    let res = phvalue - jumpValue;
    if (res > 0) {
      this.placeholder.nativeElement.style.left = res + "px";
      let placeholderLeft = res;
  
      let scrollerleft = this.scrollerContainer.nativeElement.scrollLeft;
      console.log(placeholderLeft);
      console.log(scrollerleft);
  
      let diff = placeholderLeft - scrollerleft;
      if (diff < 0) {
        this.scrollerContainer.nativeElement.scrollLeft += diff;
      }
    }
    
  }

  moveToOffset(offsetValue) {
    let left = this.placeholder.nativeElement.style.left;
    let value = (left) ? parseFloat(left.replace("px", "")) : 0;
    this.placeholder.nativeElement.style.left = (value + offsetValue) + "px";
    let extent = this.placeholder.nativeElement.offsetLeft + parseFloat(this.placeholder.nativeElement.style.width.replace("px", "")); 
    let scrollValue = 0;
    if (extent > 600) {
      let scrollLeft = this.scrollerContainer.nativeElement.scrollLeft;
      scrollValue = extent - 600;
      this.scrollerContainer.nativeElement.scrollLeft = scrollValue;
    } else if (extent < 100) {
      let scrollLeft = this.scrollerContainer.nativeElement.scrollLeft;
      let scrollValue = 100 - extent;
      scrollLeft -= scrollValue;
      if (scrollLeft > 0) {
        this.scrollerContainer.nativeElement.scrollLeft = scrollLeft;
      }
    }
    
  }
}
