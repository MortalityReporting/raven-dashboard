import {Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {LogLine} from "../../modal/log-line";

@Component({
  selector: 'lib-console',
  templateUrl: './ngx-console.component.html',
  styleUrls: ['./ngx-console.component.css']
})
export class NgxConsoleComponent implements OnChanges{
  @ViewChild('terminal') private myScrollContainer: ElementRef;
  @Input() logs: LogLine[] = [];

  scrollToElement(): void {
    this.myScrollContainer.nativeElement.scroll({
      top: this.myScrollContainer.nativeElement.scrollHeight,
      left: 0,
      behavior: 'smooth'
    });
  }
  ngOnChanges(changes: SimpleChanges): void {
    if(this.myScrollContainer?.nativeElement){
      this.scrollToElement();
    }
  }
}
