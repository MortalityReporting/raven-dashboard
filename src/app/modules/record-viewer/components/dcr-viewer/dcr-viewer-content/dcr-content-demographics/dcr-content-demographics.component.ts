import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-dcr-content-demographics',
  standalone: false,
  templateUrl: './dcr-content-demographics.component.html',
  styleUrl: './dcr-content-demographics.component.css'
})
export class DcrContentDemographicsComponent {
  @Input() dcrRecord: any;
}
