import {Component, EventEmitter, Output} from '@angular/core';
import {TestStatus} from "../../../testing-events";

@Component({
  selector: 'app-update-edrs',
  templateUrl: './update-edrs.component.html',
  styleUrls: ['./update-edrs.component.css']
})
export class UpdateEdrsComponent {
  @Output() onTestCompletedEvent = new EventEmitter<TestStatus>()

  updateStatus() {
    this.onTestCompletedEvent.emit(TestStatus.complete)
  }
}
