import {Component, inject, ChangeDetectionStrategy} from '@angular/core';
import {DeathCertificateReviewService} from "../../../services/death-certificate-review.service";
import {UtilsService} from "../../../../../service/utils.service";
import { MatButton } from '@angular/material/button';
import { CdkCopyToClipboard } from '@angular/cdk/clipboard';
import { JsonPipe } from '@angular/common';

@Component({
    selector: 'app-dcr-fhir-bundle-review',
    templateUrl: './dcr-fhir-bundle-review.component.html',
    styleUrls: ['./dcr-fhir-bundle-review.component.scss', '../death-certificate-review-submission.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatButton, CdkCopyToClipboard, JsonPipe]
})
export class DcrFhirBundleReviewComponent {

  deathCertificateReviewService = inject(DeathCertificateReviewService);
  utilsService = inject(UtilsService);

  onCopyToClipboard() {
    this.utilsService.showSuccessMessage("Content copied to clipboard.")
  }

  protected readonly JSON = JSON;
}
