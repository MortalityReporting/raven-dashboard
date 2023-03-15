import {Directive, ElementRef, HostListener, Input, Renderer2} from '@angular/core';

@Directive({
  selector: '[cardHover]'
})
export class CardHoverDirective {

  @Input() color;

  constructor(
    private elementRef: ElementRef
  ) { }

  @HostListener('mouseenter') onMouseEnter() {
    this.elementRef.nativeElement.style.borderLeftColor = this.color;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.elementRef.nativeElement.style.borderLeftColor = 'transparent';
  }
}
