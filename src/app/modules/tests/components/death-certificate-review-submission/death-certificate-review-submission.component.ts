import { Component } from '@angular/core';
import {FormControl, FormGroup} from "@angular/forms";


// http://hl7.org/fhir/us/core/ValueSet-omb-race-category.html
export const RACE = [
  {
    code: '1002-5',
    system: 'urn:oid:2.16.840.1.113883.6.238',
    display: 'American Indian or Alaska Native'
  },
  {
    code: '2028-9',
    system: 'urn:oid:2.16.840.1.113883.6.238',
    display: 'Asian'
  },
  {
    code: '2076-5',
    system: 'urn:oid:2.16.840.1.113883.6.238',
    display: 'Black or African American'
  },
  {
    code: '2076-8',
    system: 'urn:oid:2.16.840.1.113883.6.238',
    display: 'Native Hawaiian or Other Pacific Islander'
  },
  {
    code: '2106-3',
    system: 'urn:oid:2.16.840.1.113883.6.238',
    display: 'White'
  },
  {
    code: '2131-1',
    system: 'urn:oid:2.16.840.1.113883.6.238',
    display: 'Other Race'
  },
  {
    code: 'ASKU',
    system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
    display: 'Asked but Unknown'
  },
  {
    code: 'UNK',
    system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
    display: 'unknown'
  }
]


export const ETHNICITY = [
  {
    code: '2135-2',
    system: 'urn:oid:2.16.840.1.113883.6.238',
    display: 'Hispanic or Latino'
  },
  {
    code: '2135-5',
    system: 'urn:oid:2.16.840.1.113883.6.238',
    display: 'Not Hispanic or Latino'
  },
  {
    code: 'ASKU',
    system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
    display: 'Asked but Unknown'
  },
  {
    code: 'UNK',
    system: 'http://terminology.hl7.org/CodeSystem/v3-NullFlavor',
    display: 'unknown'
  }
]


@Component({
  selector: 'app-death-certificate-review-submission',
  standalone: false,
  templateUrl: './death-certificate-review-submission.component.html',
  styleUrl: './death-certificate-review-submission.component.scss'
})



export class DeathCertificateReviewSubmissionComponent {

  address = new FormGroup({
    addressLine1: new FormControl(''),
    addressLine2: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    zip: new FormControl(''),
    county: new FormControl(''),
  })

  dcrForm = new FormGroup({
    submitter: new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
    }),
    funeralHome: new FormGroup({
      name: new FormControl(''),
      address: this.address,
    }),
    deathInvestigation: new FormGroup({
      dateTime: new FormControl(''),
      placeOfDeath: new FormControl(''),
      address: this.address,
    }),
    decedentInfo: new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      race: new FormControl(''),
      ethnicity: new FormControl(''),
    })
  });
}
