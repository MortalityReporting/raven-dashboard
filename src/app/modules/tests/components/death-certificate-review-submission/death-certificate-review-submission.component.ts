import {Component} from '@angular/core';
import {Parameters} from "../../../record-viewer/services/dcr-document-handler.service";


@Component({
  selector: 'app-death-certificate-review-submission',
  standalone: false,
  templateUrl: './death-certificate-review-submission.component.html',
  styleUrl: './death-certificate-review-submission.component.scss'
})

export class DeathCertificateReviewSubmissionComponent {

  submitDcrForm(event: Parameters[]) {
    console.log(event);
  }

  onSubmitToExternalApi(event) {
    console.log(event);
  }
}
