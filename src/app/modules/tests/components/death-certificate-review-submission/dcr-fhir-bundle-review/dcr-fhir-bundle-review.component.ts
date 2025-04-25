import {Component, signal} from '@angular/core';
import {DeathCertificateReviewService} from "../../../services/death-certificate-review.service";

@Component({
  selector: 'app-dcr-fhir-bundle-review',
  standalone: false,
  templateUrl: './dcr-fhir-bundle-review.component.html',
  styleUrls: ['./dcr-fhir-bundle-review.component.scss', '../death-certificate-review-submission.component.scss']
})
export class DcrFhirBundleReviewComponent {
  fhirBundle = signal(null);

  constructor(private deathCertificateReviewService: DeathCertificateReviewService) {
    this.fhirBundle = this.deathCertificateReviewService.fhirBundle();
  }
}
