import {Component, ChangeDetectionStrategy} from '@angular/core';
import { MatCard, MatCardHeader, MatCardTitle, MatCardContent, MatCardSubtitle } from '@angular/material/card';
import { DcrFormSubmissionComponent } from './dcr-form-submission/dcr-form-submission.component';
import { DcrFhirBundleReviewComponent } from './dcr-fhir-bundle-review/dcr-fhir-bundle-review.component';
import { ExternalApiDataSubmission } from '../external-api-data-submission/external-api-data-submission.component';

@Component({
    selector: 'app-death-certificate-review-submission',
    templateUrl: './death-certificate-review-submission.component.html',
    styleUrl: './death-certificate-review-submission.component.scss',
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [MatCard, MatCardHeader, MatCardTitle, MatCardContent, DcrFormSubmissionComponent, DcrFhirBundleReviewComponent, MatCardSubtitle, ExternalApiDataSubmission]
})

export class DeathCertificateReviewSubmissionComponent {}
