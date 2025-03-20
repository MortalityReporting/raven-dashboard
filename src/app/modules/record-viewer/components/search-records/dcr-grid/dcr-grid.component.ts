import {Component, EventEmitter, Output} from '@angular/core';

@Component({
  selector: 'dcr-grid',
  standalone: false,
  templateUrl: './dcr-grid.component.html',
  styleUrl: './dcr-grid.component.scss'
})
export class DcrGridComponent {
  @Output() serverErrorEventEmitter = new EventEmitter();

}
