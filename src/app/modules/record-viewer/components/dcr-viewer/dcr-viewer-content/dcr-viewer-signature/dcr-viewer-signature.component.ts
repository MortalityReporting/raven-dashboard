import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-dcr-viewer-signature',
  standalone: false,
  templateUrl: './dcr-viewer-signature.component.html',
  styleUrl: './dcr-viewer-signature.component.css'
})
export class DcrViewerSignatureComponent {
  @Input() signature!: any;
}
