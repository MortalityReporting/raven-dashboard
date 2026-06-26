import { Directive, ElementRef, Renderer2, input } from '@angular/core';

@Directive({
  selector: '[cardHover]',
  host: {
    '(mouseenter)': 'onMouseEnter()',
    '(mouseleave)': 'onMouseLeave()'
  }
})
export class CardHoverDirective {
  // Use signal-based input
  color = input<string>();

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {}

  onMouseEnter() {
    const colorValue = this.color();
    if (colorValue) {
      this.renderer.setStyle(
        this.elementRef.nativeElement,
        'border-left-color',
        colorValue
      );
    }
  }

  onMouseLeave() {
    this.renderer.setStyle(
      this.elementRef.nativeElement,
      'border-left-color',
      'transparent'
    );
  }
}
