import {Component, input, Input} from '@angular/core';
import {Demographics} from "../../../../models/case.summary";

@Component({
  selector: 'app-dcr-content-demographics',
  standalone: false,
  templateUrl: './dcr-content-demographics.component.html',
  styleUrl: './dcr-content-demographics.component.css'
})
export class DcrContentDemographicsComponent {
  demographics = input<Demographics>();
}
