import {Component, inject} from '@angular/core';
import {DeathCertificateReviewService} from "../../../services/death-certificate-review.service";
import {UtilsService} from "../../../../../service/utils.service";

@Component({
  selector: 'app-dcr-fhir-bundle-review',
  standalone: false,
  templateUrl: './dcr-fhir-bundle-review.component.html',
  styleUrls: ['./dcr-fhir-bundle-review.component.scss', '../death-certificate-review-submission.component.scss']
})
export class DcrFhirBundleReviewComponent {

  deathCertificateReviewService = inject(DeathCertificateReviewService);
  utilsService = inject(UtilsService);

  onCopyToClipboard() {
    this.utilsService.showSuccessMessage("Content copied to clipboard.")
  }

  protected readonly JSON = JSON;
}
