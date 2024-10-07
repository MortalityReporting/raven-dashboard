import {Component, Input} from '@angular/core';
import {Bundle} from "../../../fhir-util";

@Component({
  selector: 'rc-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  @Input() referenceRecordBundle!: Bundle;

}
