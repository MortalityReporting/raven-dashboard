import {Component, input} from '@angular/core';
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-simple-json-viewer',
  imports: [
    JsonPipe
  ],
  templateUrl: './simple-json-viewer.component.html',
  styleUrl: './simple-json-viewer.component.scss'
})
export class SimpleJsonViewerComponent {
  messageBundle = input<any>(null)
}
