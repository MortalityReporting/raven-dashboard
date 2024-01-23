import {Component, EventEmitter, Output} from '@angular/core';
import {TestStatusCodes} from "../../../testing-events";

@Component({
  selector: 'app-generic-file-submission',
  standalone: true,
  imports: [],
  templateUrl: './generic-file-submission.component.html',
  styleUrl: './generic-file-submission.component.css'
})
export class GenericFileSubmissionComponent {
  @Output() onTestCompletedEvent = new EventEmitter<TestStatusCodes>()

  updateStatus() {
    this.onTestCompletedEvent.emit(TestStatusCodes.complete)
  }
}
