import {Component, input} from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { ToxToMdiViewerContentComponent } from '../../../../record-viewer/components/tox-to-mdi-viewer/tox-to-mdi-viewer-content/tox-to-mdi-viewer-content.component';
import { SimpleJsonViewerComponent } from '../simple-json-viewer/simple-json-viewer.component';

@Component({
    selector: 'tests-tox-record-details',
    templateUrl: './tox-record-details.component.html',
    styleUrl: './tox-record-details.component.scss',
    imports: [MatTabGroup, MatTab, ToxToMdiViewerContentComponent, SimpleJsonViewerComponent]
})
export class ToxRecordDetailsComponent {
  selectedToxRecord = input<any>(null)
}
