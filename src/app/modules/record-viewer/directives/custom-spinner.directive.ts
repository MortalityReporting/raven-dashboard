import { Directive, Input, ElementRef, AfterViewInit } from '@angular/core';

@Directive({
    selector: "[customSpinner]",
    standalone: false
})
export class CustomSpinnerDirective implements AfterViewInit{

  @Input() spinnerColor: string;

  constructor(
    private elem: ElementRef
  ){}

  ngAfterViewInit(){
    if(!!this.spinnerColor){
      const element = this.elem.nativeElement;
      const circle = element.querySelector("circle");
      circle.style.stroke = this.spinnerColor;
    }
  }

}

// Code from https://stackoverflow.com/questions/48786027/angular-material-mat-spinner-custom-color
