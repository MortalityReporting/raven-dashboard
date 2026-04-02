import {Component, input} from '@angular/core';

@Component({
    selector: 'record-viewer-mdi-to-edrs-viewer-content-field',
    templateUrl: './mdi-to-edrs-viewer-content-field.component.html',
    styleUrls: ['../mdi-to-edrs-viewer.component.scss', '../../../record-viewer-styles.scss'],
    standalone: false
})
export class MdiToEdrsViewerContentFieldComponent {
  label = input<string>('');
  value = input<string>('');

  // Generate a unique ID for each instance
  private static counter = 0;
  protected elementId = `content-field-${++MdiToEdrsViewerContentFieldComponent.counter}`;
}
