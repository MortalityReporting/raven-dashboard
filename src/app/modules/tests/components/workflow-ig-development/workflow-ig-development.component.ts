import {Component, EventEmitter, Output} from '@angular/core';
import {TestStatusCodes} from "../../../testing-events";

@Component({
  selector: 'app-workflow-ig-development',
  standalone: true,
  imports: [],
  templateUrl: './workflow-ig-development.component.html',
  styleUrl: './workflow-ig-development.component.css'
})
export class WorkflowIgDevelopmentComponent {

  @Output() onTestCompletedEvent = new EventEmitter<TestStatusCodes>()

  updateStatus() {
    this.onTestCompletedEvent.emit(TestStatusCodes.complete)
  }
}
