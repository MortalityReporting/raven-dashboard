import {Component, Input} from '@angular/core';
import {Author} from "../../../models/case.header";

@Component({
    selector: 'record-viewer-mdi-to-edrs-viewer-practitioner-card',
    templateUrl: './mdi-to-edrs-viewer-practitioner-card.component.html',
    styleUrls: ['../mdi-to-edrs-viewer.component.scss'],
    standalone: false
})
export class MdiToEdrsViewerPractitionerCardComponent {
  @Input() practitioner: Author;

}
