import {Component, input, Input} from '@angular/core';

@Component({
  selector: 'app-dcr-error-viewer',
  standalone: false,
  templateUrl: './dcr-error-viewer.component.html',
  styleUrl: './dcr-error-viewer.component.css'
})
export class DcrErrorViewerComponent {
    errorResponse= input<any>();
}
