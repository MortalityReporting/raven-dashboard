import {Component, input} from '@angular/core';

@Component({
  selector: 'tests-tox-record-details',
  templateUrl: './tox-record-details.component.html',
  styleUrl: './tox-record-details.component.scss',
  standalone: false
})
export class ToxRecordDetailsComponent {
  selectedToxRecord = input<any>(null)
}
