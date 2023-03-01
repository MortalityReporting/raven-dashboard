import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
  selector: "[moduleThemedButton]"
})
export class ModuleThemedButtonDirective implements AfterViewInit{

  @Input() moduleColor: string;

  constructor(
    private elem: ElementRef
  ){}

  ngAfterViewInit(){
    if(!!this.moduleColor){
      const element = this.elem.nativeElement;
      element.style.backgroundColor = this.moduleColor;
    }
  }

}
