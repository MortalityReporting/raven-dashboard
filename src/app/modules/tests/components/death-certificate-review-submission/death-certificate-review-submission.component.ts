import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, UntypedFormArray, UntypedFormControl} from "@angular/forms";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {ETHNICITY, RACE_CATEGORIES} from "../../providers/module-constants"
import {MatCheckboxChange} from "@angular/material/checkbox";


@Component({
  selector: 'app-death-certificate-review-submission',
  standalone: false,
  templateUrl: './death-certificate-review-submission.component.html',
  styleUrl: './death-certificate-review-submission.component.scss'
})

export class DeathCertificateReviewSubmissionComponent implements OnInit {
  readonly ETHNICITY = Object.values(ETHNICITY);
  readonly RACE_CATEGORIES = Object.values(RACE_CATEGORIES);

  race = new FormGroup({
    raceCheck:  this.createRaceCategoryControls(RACE_CATEGORIES.slice(0, 5)),
    raceRadio: new FormControl(''),
  });

  address = new FormGroup({
    addressLine1: new FormControl(''),
    addressLine2: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    zip: new FormControl(''),
  })

  dcrForm = new FormGroup({
    submitter: new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      email: new FormControl(''),
      phone: new FormControl(''),
      fax: new FormControl(''),
    }),
    funeralHome: new FormGroup({
      name: new FormControl(''),
      address: this.address,
    }),
    deathInvestigation: new FormGroup({
      dateOfDeath: new FormControl(''),
      timeOfDeath: new FormControl(''),
      placeOfDeath: new FormControl(''),
      address: this.address,
    }),
    decedentInfo: new FormGroup({
      firstName: new FormControl(''),
      lastName: new FormControl(''),
      middleName: new FormControl(''),
      race: this.race,
      ethnicity: new FormControl(''),
    })
  });

  constructor(@Inject('importConfig') public config: ModuleHeaderConfig) { }


  onSubmit() {
    console.log(this.dcrForm)
  }

  ngOnInit(): void {
    this.dcrForm.valueChanges.subscribe(value=> console.log(this.dcrForm))
  }

  private createRaceCategoryControls(raceCategories) {
    const arr = raceCategories.map(category => {
      return new UntypedFormControl(category.selected || false);
    });
    return new UntypedFormArray(arr);
  }

  onRaceCategoryCheckboxChange(event: MatCheckboxChange) {
    console.log(event)
  }
}
