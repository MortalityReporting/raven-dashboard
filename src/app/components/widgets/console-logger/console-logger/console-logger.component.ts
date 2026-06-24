import {Component, effect, ElementRef, input, viewChild, ChangeDetectionStrategy} from '@angular/core';
import {LogLine} from "../model/log-line";
import {DatePipe, NgClass} from "@angular/common";

@Component({
  selector: 'app-console-logger',
  imports: [
    DatePipe,
    NgClass
  ],
  templateUrl: './console-logger.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './console-logger.component.css',
})
export class ConsoleLoggerComponent {
  myScrollContainer = viewChild<ElementRef>('terminal');

  logs = input<LogLine[]>([]);

  constructor() {
    // Effect to scroll when logs change
    effect(() => {
      const logs = this.logs(); // Track the signal
      const container = this.myScrollContainer();

      if (container?.nativeElement) {
        this.scrollToElement();
      }
    });
  }

  scrollToElement(): void {
    const container = this.myScrollContainer();
    if (container?.nativeElement) {
      container.nativeElement.scroll({
        top: container.nativeElement.scrollHeight,
        left: 0,
        behavior: 'smooth'
      });
    }
  }
}
