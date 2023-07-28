import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'record-viewer-mdi-to-edrs-viewer-content-field',
  templateUrl: './mdi-to-edrs-viewer-content-field.component.html',
  styleUrls: ['../mdi-to-edrs-viewer.component.css', '../../../record-viewer-styles.scss']
})
export class MdiToEdrsViewerContentFieldComponent implements OnInit {
  @Input() label: string;
  @Input() value: any;

  constructor() { }

  ngOnInit(): void {
  }

}
