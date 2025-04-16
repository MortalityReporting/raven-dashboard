import {Component, input, OnInit} from '@angular/core';

@Component({
    selector: 'record-viewer-mdi-to-edrs-viewer-content-field',
    templateUrl: './mdi-to-edrs-viewer-content-field.component.html',
    styleUrls: ['../mdi-to-edrs-viewer.component.scss', '../../../record-viewer-styles.scss'],
    standalone: false
})
export class MdiToEdrsViewerContentFieldComponent implements OnInit {
  label = input()
  value = input()
  constructor() { }

  ngOnInit(): void {
  }

}
