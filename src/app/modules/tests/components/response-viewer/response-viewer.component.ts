import {Component, input} from '@angular/core';

@Component({
  selector: 'app-response-viewer',
  standalone: false,
  templateUrl: './response-viewer.component.html',
  styleUrl: './response-viewer.component.css'
})
export class ResponseViewerComponent {
    errorResponse= input<any>();
    successResponse= input<any>();
    requestHeader = input<any>();
}
