import {Component, EventEmitter, Output} from '@angular/core';
import {TestStatusCodes} from "../../../testing-events";

@Component({
    selector: 'app-validation',
    templateUrl: './validation.component.html',
    styleUrls: ['./validation.component.css'],
    standalone: false
})
export class ValidationComponent {
  @Output() onTestCompletedEvent = new EventEmitter<TestStatusCodes>()

  updateStatus() {
    this.onTestCompletedEvent.emit(TestStatusCodes.complete)
  }
}
