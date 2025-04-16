import {Component, input} from '@angular/core';
import {SignatureBlock} from "../../../../models/dcr-record";

@Component({
  selector: 'app-dcr-viewer-signature',
  standalone: false,
  templateUrl: './dcr-viewer-signature.component.html',
  styleUrls: ['./dcr-viewer-signature.component.css',
    '../../../mdi-to-edrs-viewer/mdi-to-edrs-viewer.component.scss']
})
export class DcrViewerSignatureComponent {
  signature = input<SignatureBlock>()
}
