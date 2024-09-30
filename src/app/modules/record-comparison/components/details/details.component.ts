import {Component, Input} from '@angular/core';
import {MdiToEDRSDocumentWrapper} from "../../models/mdiToEdrsDocumentWrapper";

@Component({
  selector: 'rc-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.scss'
})
export class DetailsComponent {
  @Input() userDocumentWrapper!: MdiToEDRSDocumentWrapper;

}
