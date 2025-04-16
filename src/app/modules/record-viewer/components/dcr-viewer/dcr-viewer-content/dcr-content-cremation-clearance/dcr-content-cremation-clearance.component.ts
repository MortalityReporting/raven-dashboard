import {Component, input} from '@angular/core';
import {CremationClearanceInfo} from "../../../../models/dcr-record";

@Component({
  selector: 'app-dcr-content-cremation-clearance',
  standalone: false,
  templateUrl: './dcr-content-cremation-clearance.component.html',
  styleUrl: './dcr-content-cremation-clearance.component.css'
})
export class DcrContentCremationClearanceComponent {
  cremationClearanceInfo = input<CremationClearanceInfo>();
}
