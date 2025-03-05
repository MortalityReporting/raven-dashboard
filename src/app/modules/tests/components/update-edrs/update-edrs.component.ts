import {Component, EventEmitter, Output} from '@angular/core';
import {TestStatusCodes} from "../../../testing-events";

@Component({
    selector: 'app-update-edrs',
    templateUrl: './update-edrs.component.html',
    styleUrls: ['./update-edrs.component.css'],
    standalone: false
})
export class UpdateEdrsComponent {
  @Output() onTestCompletedEvent = new EventEmitter<TestStatusCodes>()

  updateStatus() {
    this.onTestCompletedEvent.emit(TestStatusCodes.complete)
  }
}
