import {Component, Inject, OnInit} from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  UntypedFormArray,
  UntypedFormControl, ValidationErrors,
  Validators
} from "@angular/forms";
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
    addressLine1: new FormControl('', Validators.required),
    addressLine2: new FormControl(''),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
  })

  dcrForm = new FormGroup({
    submitter: new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.required),
    }),
    funeralHome: new FormGroup({
      name: new FormControl('', Validators.required),
      address: this.address,
      phone: new FormControl('', Validators.required),
      fax: new FormControl(''),
    }),
    deathInvestigation: new FormGroup({
      dateOfDeath: new FormControl('', Validators.required),
      timeOfDeath: new FormControl(''),
      placeOfDeath: this.placeOfDeath,
      address: this.address,
    }),
    decedentInfo: new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      middleName: new FormControl(''),
      race: this.race,
      ethnicity: new FormControl(''),
    })
  });

  constructor(@Inject('importConfig') public config: ModuleHeaderConfig) { }


  onSubmit() {
    this.dcrForm.controls.decedentInfo.controls.ethnicity.setValidators([Validators.required]);
    this.dcrForm.controls.decedentInfo.controls.ethnicity.updateValueAndValidity();

    this.dcrForm.controls.decedentInfo.controls.race.setValidators([this.raceValidator]);
    this.dcrForm.controls.decedentInfo.controls.race.updateValueAndValidity();

    this.dcrForm.controls.deathInvestigation.controls.placeOfDeath.setValidators([this.placeOfDeathRequiredValidator, this.placeOfDeathDescriptionRequiredValidator]);
    this.dcrForm.controls.deathInvestigation.controls.placeOfDeath.updateValueAndValidity();

    this.dcrForm.updateValueAndValidity()
  }

  ngOnInit(): void {
    this.dcrForm.valueChanges.subscribe(value=> {
    });
  }

  private createRaceCategoryControls(raceCategories) {
    const arr = raceCategories.map(category => {
      return new UntypedFormControl(category.selected || false);
    });
    return new UntypedFormArray(arr);
  }

  onRaceCategoryCheckboxChange(event: MatCheckboxChange) {
    this.race.controls['raceRadio'].reset();
  }

  onRaceCategoryRadioChange(event: MatRadioChange) {
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

  private raceValidator(control: AbstractControl): ValidationErrors | null  {
    const value = control.value;
    if (value?.raceCheck?.find(check=> !!check) || value?.raceRadio) {
      return null;
    }
    return { raceSelectionRequired: true }; //Return error object if invalid
  }

  private placeOfDeathRequiredValidator(control: AbstractControl): ValidationErrors | null  {
    const value = control.value;
    if (value?.placeOfDeathRadio) {
      return null;
    }
    return { placeOfDeathRequired: true }; //Return error object if invalid
  }

  private placeOfDeathDescriptionRequiredValidator(control: AbstractControl): ValidationErrors | null  {
    const value = control.value;
    if (value?.placeOfDeathRadio !== 'Other' || value?.description) {
      return null;
    }
    return { placeOfDeathDescriptionRequired: true }; //Return error object if invalid
  }

}
