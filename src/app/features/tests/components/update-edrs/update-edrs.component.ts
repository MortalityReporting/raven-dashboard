import {Component, EventEmitter, Output, ChangeDetectionStrategy} from '@angular/core';
import {TestStatusCodes} from "../../../testing-events";

@Component({
    selector: 'app-update-edrs',
    templateUrl: './update-edrs.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrls: ['./update-edrs.component.css']
})
export class UpdateEdrsComponent {
  @Output() onTestCompletedEvent = new EventEmitter<TestStatusCodes>()

  updateStatus() {
    this.onTestCompletedEvent.emit(TestStatusCodes.complete)
  }
}
