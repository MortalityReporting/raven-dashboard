import {Component, EventEmitter, Output, ChangeDetectionStrategy} from '@angular/core';
import {TestStatusCodes} from "../../../testing-events";

@Component({
    selector: 'app-generic-file-submission',
    imports: [],
    templateUrl: './generic-file-submission.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './generic-file-submission.component.css'
})
export class GenericFileSubmissionComponent {
  @Output() onTestCompletedEvent = new EventEmitter<TestStatusCodes>()

  updateStatus() {
    this.onTestCompletedEvent.emit(TestStatusCodes.complete)
  }
}
