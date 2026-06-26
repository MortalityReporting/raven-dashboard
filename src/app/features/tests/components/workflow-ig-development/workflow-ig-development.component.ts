import {Component, EventEmitter, Output, ChangeDetectionStrategy} from '@angular/core';
import {TestStatusCodes} from "../../../testing-events";

@Component({
    selector: 'app-workflow-ig-development',
    imports: [],
    templateUrl: './workflow-ig-development.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './workflow-ig-development.component.css'
})
export class WorkflowIgDevelopmentComponent {

  @Output() onTestCompletedEvent = new EventEmitter<TestStatusCodes>()

  updateStatus() {
    this.onTestCompletedEvent.emit(TestStatusCodes.complete)
  }
}
