import { Component, output, ChangeDetectionStrategy } from '@angular/core';
import { TestStatusCodes } from '../../../testing-events';

@Component({
  selector: 'app-update-edrs',
  templateUrl: './update-edrs.component.html',
  styleUrls: ['./update-edrs.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class UpdateEdrsComponent {
  onTestCompletedEvent = output<TestStatusCodes>();

  updateStatus() {
    this.onTestCompletedEvent.emit(TestStatusCodes.complete);
  }
}
