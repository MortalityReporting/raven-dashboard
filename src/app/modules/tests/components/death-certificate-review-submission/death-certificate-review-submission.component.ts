import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, UntypedFormArray, UntypedFormControl} from "@angular/forms";
import {ModuleHeaderConfig} from "../../../../providers/module-header-config";
import {ETHNICITY, PLACE_OF_DEATH, RACE_CATEGORIES} from "../../providers/module-constants"
import {MatCheckboxChange} from "@angular/material/checkbox";
import {MatRadioChange} from "@angular/material/radio";



@Component({
  selector: 'app-death-certificate-review-submission',
  standalone: false,
  templateUrl: './death-certificate-review-submission.component.html',
  styleUrl: './death-certificate-review-submission.component.scss'
})

export class DeathCertificateReviewSubmissionComponent implements OnInit {
  readonly ETHNICITY = Object.values(ETHNICITY);
  readonly RACE_CATEGORIES = Object.values(RACE_CATEGORIES);
  readonly PLACE_OF_DEATH = Object.values(PLACE_OF_DEATH);

  placeOfDeath = new FormGroup({
    placeOfDeathRadio: new FormControl(''),
    description: new FormControl({value: '', disabled: true}),
  });


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
    }),
    funeralHome: new FormGroup({
      name: new FormControl(''),
      address: this.address,
      phone: new FormControl(''),
      fax: new FormControl(''),
    }),
    deathInvestigation: new FormGroup({
      dateOfDeath: new FormControl(''),
      timeOfDeath: new FormControl(''),
      placeOfDeath: this.placeOfDeath,
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
    this.dcrForm.valueChanges.subscribe(value=> console.log(this.dcrForm));
  }

  private createRaceCategoryControls(raceCategories) {
    const arr = raceCategories.map(category => {
      return new UntypedFormControl(category.selected || false);
    });
    return new UntypedFormArray(arr);
  }

  onRaceCategoryCheckboxChange(event: MatCheckboxChange) {
    console.log(event);
    this.race.controls['raceRadio'].reset();
  }

  onRaceCategoryRadioChange(event: MatRadioChange) {
    console.log(event);
    this.race.controls['raceCheck'].reset();
  }

  onRacePlaceOfDeathRadioChange(event: MatRadioChange) {
    if(event.value != 'Other'){
      this.placeOfDeath.controls['description'].reset();
      this.placeOfDeath.controls['description'].disable();
    }
    else{
      this.placeOfDeath.controls['description'].enable();
    }
  }

}
