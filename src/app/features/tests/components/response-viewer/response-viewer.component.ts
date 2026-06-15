import {Component, input} from '@angular/core';
import { MatTabGroup, MatTab } from '@angular/material/tabs';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-response-viewer',
    templateUrl: './response-viewer.component.html',
    styleUrl: './response-viewer.component.css',
    imports: [MatTabGroup, MatTab, JsonPipe]
})
export class ResponseViewerComponent {
    errorResponse= input<any>();
    successResponse= input<any>();
    requestHeader = input<any>();
}
