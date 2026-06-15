import {Component, EventEmitter, Output, ChangeDetectionStrategy} from '@angular/core';
import {TestStatusCodes} from "../../../testing-events";

@Component({
    selector: 'app-validation',
    templateUrl: './validation.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./validation.component.css']
})
export class ValidationComponent {
  @Output() onTestCompletedEvent = new EventEmitter<TestStatusCodes>()

  updateStatus() {
    this.onTestCompletedEvent.emit(TestStatusCodes.complete)
  }
}
