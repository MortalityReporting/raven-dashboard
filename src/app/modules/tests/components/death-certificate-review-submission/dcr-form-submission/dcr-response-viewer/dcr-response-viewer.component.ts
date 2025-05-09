import {Component, input, Input} from '@angular/core';

@Component({
  selector: 'app-dcr-response-viewer',
  standalone: false,
  templateUrl: './dcr-response-viewer.component.html',
  styleUrl: './dcr-response-viewer.component.css'
})
export class DcrResponseViewerComponent {
    errorResponse= input<any>();
    successResponse= input<any>();
}
