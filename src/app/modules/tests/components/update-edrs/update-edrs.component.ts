import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'app-update-edrs',
  templateUrl: './update-edrs.component.html',
  styleUrls: ['./update-edrs.component.css']
})
export class UpdateEdrsComponent {
  @Output() onTestCompletedEvent = new EventEmitter<any>()

  updateStatus() {
    this.onTestCompletedEvent.emit()
  }
}
