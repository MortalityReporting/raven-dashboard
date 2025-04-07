import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-dcr-content-cremation-clearance',
  standalone: false,
  templateUrl: './dcr-content-cremation-clearance.component.html',
  styleUrl: './dcr-content-cremation-clearance.component.css'
})
export class DcrContentCremationClearanceComponent {
  @Input() cremationClearanceInfo!: any;
}
