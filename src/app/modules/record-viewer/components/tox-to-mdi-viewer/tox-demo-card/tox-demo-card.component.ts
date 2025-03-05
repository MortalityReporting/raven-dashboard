import {Component, Input} from '@angular/core';
import {ToxDemographics} from "../../../models/tox.summary";

@Component({
    selector: 'record-viewer-tox-to-mdi-viewer-demographics',
    templateUrl: './tox-demo-card.component.html',
    styleUrls: ['../tox-to-mdi-viewer.component.css'],
    standalone: false
})
export class ToxDemoCardComponent {
  @Input() demographics: ToxDemographics;

}
