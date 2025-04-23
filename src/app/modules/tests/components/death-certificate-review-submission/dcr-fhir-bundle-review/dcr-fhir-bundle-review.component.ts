import {Component, ElementRef, ViewChild} from '@angular/core';

@Component({
  selector: 'app-dcr-fhir-bundle-review',
  standalone: false,
  templateUrl: './dcr-fhir-bundle-review.component.html',
  styleUrls: ['./dcr-fhir-bundle-review.component.scss', '../death-certificate-review-submission.component.scss']
})
export class DcrFhirBundleReviewComponent {
  fhirResource: any;
}
