import {Component, Inject, output, ViewChild} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ValidationErrors,
  Validators
} from "@angular/forms";
import {ModuleHeaderConfig} from "../../../../../providers/module-header-config";
import {Parameters} from "../../../../record-viewer/services/dcr-document-handler.service";
import {MatCheckboxChange} from "@angular/material/checkbox";
import {MatRadioChange} from "@angular/material/radio";
import {ETHNICITY, PLACE_OF_DEATH, RACE_CATEGORIES} from "../../../providers/module-constants"
import {DeathCertificateReviewService} from "../../../services/death-certificate-review.service";
import {UtilsService} from "../../../../../service/utils.service";

@Component({
  selector: 'app-dcr-form-submission',
  standalone: false,
  templateUrl: './dcr-form-submission.component.html',
  styleUrls: ['./dcr-form-submission.component.scss', '../death-certificate-review-submission.component.scss'],
})
export class DcrFormSubmissionComponent {

  submitDcrForm = output<Parameters[]>();
  @ViewChild('formDirective') formDirective: FormGroupDirective;

  readonly ETHNICITY = Object.values(ETHNICITY);
  readonly RACE_CATEGORIES = Object.values(RACE_CATEGORIES);
  readonly PLACE_OF_DEATH = Object.values(PLACE_OF_DEATH);

  placeOfDeath = new FormGroup({
    placeOfDeathRadio: new FormControl(''),
    description: new FormControl({value: '', disabled: true}),
  });

  race = new FormGroup({
    raceCheck: this.fb.array(this.RACE_CATEGORIES.slice(0, 5).map(() => new FormControl(false))),
    raceRadio: new FormControl(''),
    description: new FormControl({value: '', disabled: true}),
  });

  address = new FormGroup({
    addressLine1: new FormControl('', [Validators.required]),
    addressLine2: new FormControl(''),
    city: new FormControl('', Validators.required),
    state: new FormControl('', Validators.required),
    zip: new FormControl('', Validators.required),
  });

  optionalAddress = new FormGroup({
    addressLine1: new FormControl(''),
    addressLine2: new FormControl(''),
    city: new FormControl(''),
    state: new FormControl(''),
    zip: new FormControl(''),
  });

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
      address: this.optionalAddress,
    }),
    decedentInfo: new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      middleName: new FormControl(''),
      race: this.race,
      ethnicity: new FormControl(''),
    })
  });

  constructor(
    @Inject('importConfig') public config: ModuleHeaderConfig,
    private deathCertificateReviewService: DeathCertificateReviewService,
    private fb: FormBuilder,
    private utilService: UtilsService
  ) {
  }


  onSubmit() {
    this.constructValidatorsAndValidate();
    const data = this.constructParametersResource();
    if (this.dcrForm.invalid) {
      this.utilService.showErrorMessage("Invalid form detected. Please fill all required fields");
    } else {
      this.deathCertificateReviewService.generateDcrFhirBundle(data).subscribe({
        next: result => {
          console.log(result);
        },
        error: err => {
          console.error(err);
          this.utilService.showErrorMessage(err.message);
        }
      })
    }

  }

  onRaceCategoryCheckboxChange(event: MatCheckboxChange) {
    this.race.controls.raceRadio.reset();
    this.race.controls.description.reset();
    this.race.controls.description.disable();
  }

  onRaceCategoryRadioChange(event: MatRadioChange) {
    this.race.controls['raceCheck'].reset();
    if (event.value.display != 'Other') {
      this.race.controls.description.reset();
      this.race.controls.description.disable();
    } else {
      this.race.controls.description.enable();
    }
  }

  onRacePlaceOfDeathRadioChange(event: MatRadioChange) {
    if (event.value != 'Other') {
      this.placeOfDeath.controls.description.reset();
      this.placeOfDeath.controls.description.disable();
    } else {
      this.placeOfDeath.controls.description.enable();
    }
  }

  private raceValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value?.raceCheck?.find(check => !!check) || value?.raceRadio) {
      return null;
    }
    return {raceSelectionRequired: true}; //Return error object if invalid
  }

  private raceDescriptionRequiredValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value?.raceRadio?.display !== 'Other' || value?.description) {
      return null;
    }
    return {raceDescriptionRequired: true}; //Return error object if invalid
  }

  private placeOfDeathRequiredValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value?.placeOfDeathRadio) {
      return null;
    }
    return {placeOfDeathRequired: true}; //Return error object if invalid
  }

  private placeOfDeathDescriptionRequiredValidator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value?.placeOfDeathRadio !== 'Other' || value?.description) {
      return null;
    }
    return {placeOfDeathDescriptionRequired: true}; //Return error object if invalid
  }

  private constructValidatorsAndValidate() {
    this.dcrForm.controls.decedentInfo.controls.ethnicity.setValidators([Validators.required]);
    this.dcrForm.controls.decedentInfo.controls.ethnicity.updateValueAndValidity();

    this.dcrForm.controls.decedentInfo.controls.race.setValidators([this.raceValidator, this.raceDescriptionRequiredValidator]);
    this.dcrForm.controls.decedentInfo.controls.race.updateValueAndValidity();

    this.dcrForm.controls.deathInvestigation.controls.placeOfDeath.setValidators([this.placeOfDeathRequiredValidator, this.placeOfDeathDescriptionRequiredValidator]);
    this.dcrForm.controls.deathInvestigation.controls.placeOfDeath.updateValueAndValidity();

  }

  private constructParametersResource(): Parameters[] {
    let parameters: Parameters[] = [];

    const name: Parameters = {name: 'type', valueString: 'ccr'};
    parameters.push(name);

    //Submitter Section
    const submitterFirstName = {
      name: 'submitterFirstName',
      valueString: this.dcrForm.controls.submitter.controls.firstName.value
    };
    parameters.push(submitterFirstName);

    const submitterLastName = {
      name: 'submitterLastName',
      valueString: this.dcrForm.controls.submitter.controls.lastName.value
    };
    parameters.push(submitterLastName);

    const submitterEmail = {name: 'submitterEmail', valueString: this.dcrForm.controls.submitter.controls.email.value};
    parameters.push(submitterEmail);


    //Funeral Home Section
    const funeralHomeName = {
      name: 'funeralHomeName',
      valueString: this.dcrForm.controls.funeralHome.controls.name.value
    };
    parameters.push(funeralHomeName);

    const funeralHomeAddrLine1 = {
      name: 'funeralHomeAddrLine1',
      valueString: this.dcrForm.controls.funeralHome.controls.address.controls.addressLine1.value
    };
    parameters.push(funeralHomeAddrLine1);

    const funeralHomeAddrLine2 = {
      name: 'funeralHomeAddrLine2',
      valueString: this.dcrForm.controls.funeralHome.controls.address.controls.addressLine2.value ?? ""
    };
    parameters.push(funeralHomeAddrLine2);

    const funeralHomeAddrCity = {
      name: 'funeralHomeAddrCity',
      valueString: this.dcrForm.controls.funeralHome.controls.address.controls.city.value
    };
    parameters.push(funeralHomeAddrCity);

    const funeralHomeAddrZip = {
      name: 'funeralHomeAddrZip',
      valueString: this.dcrForm.controls.funeralHome.controls.address.controls.zip.value
    };
    parameters.push(funeralHomeAddrZip);

    const funeralHomeAddrPhone = {
      name: 'funeralHomeAddrPhone',
      valueString: this.dcrForm.controls.funeralHome.controls.phone.value
    };
    parameters.push(funeralHomeAddrPhone);

    const funeralHomeAddrFax = {
      name: 'funeralHomeAddrFax',
      valueString: this.dcrForm.controls.funeralHome.controls.fax.value ?? ""
    };
    parameters.push(funeralHomeAddrFax);

    //Death Investigation Section
    const dateOfDeathStr = this.getDateStr(this.dcrForm.controls.deathInvestigation.controls.dateOfDeath.value)


    const timeOfDeathStr = this.getTimeStr(this.dcrForm.controls.deathInvestigation.controls.timeOfDeath.value);
    if (timeOfDeathStr) {
      parameters.push({name: 'dateOfDeath', valueDateTime: `${dateOfDeathStr}T${timeOfDeathStr}`});
    } else {
      parameters.push({name: 'dateOfDeath', valueDateTime: dateOfDeathStr});
    }

    let placeOfDeathObj = this.dcrForm.controls.deathInvestigation.controls.placeOfDeath.value;
    if (placeOfDeathObj.placeOfDeathRadio != "Other") {
      const placeOfDeath = {name: 'placeOfDeath', valueString: placeOfDeathObj.placeOfDeathRadio};
      parameters.push(placeOfDeath);

      const placeOfDeathOther = {name: 'placeOfDeathOther', valueString: ""};
      parameters.push(placeOfDeathOther);
    } else {
      const placeOfDeath = {name: 'placeOfDeath', valueString: placeOfDeathObj.placeOfDeathRadio};
      parameters.push(placeOfDeath);

      const placeOfDeathOther = {name: 'placeOfDeathOther', valueString: placeOfDeathObj.description};
      parameters.push(placeOfDeathOther);
    }
    const placeOfDeathAddrLine1 = {
      name: 'placeOfDeathAddrLine1',
      valueString: this.dcrForm.controls.deathInvestigation.controls.address.controls.addressLine1.value ?? ''
    };
    parameters.push(placeOfDeathAddrLine1);

    const placeOfDeathAddrLine2 = {
      name: 'placeOfDeathAddrLine2',
      valueString: this.dcrForm.controls.deathInvestigation.controls.address.controls.addressLine2.value ?? ''
    };
    parameters.push(placeOfDeathAddrLine2);

    const placeOfDeathAddrCity = {
      name: 'placeOfDeathAddrLine2',
      valueString: this.dcrForm.controls.deathInvestigation.controls.address.controls.city.value ?? ''
    };
    parameters.push(placeOfDeathAddrCity);

    const placeOfDeathAddrState = {
      name: 'placeOfDeathAddrState',
      valueString: this.dcrForm.controls.deathInvestigation.controls.address.controls.state.value ?? ''
    };
    parameters.push(placeOfDeathAddrState);

    const placeOfDeathAddrZip = {
      name: 'placeOfDeathAddrZip',
      valueString: this.dcrForm.controls.deathInvestigation.controls.address.controls.zip.value ?? ''
    };
    parameters.push(placeOfDeathAddrZip);


    //Decedent Info Section
    const decedentFirstName = {
      name: 'decedentFirstName',
      valueString: this.dcrForm.controls.decedentInfo.controls.firstName.value
    };
    parameters.push(decedentFirstName);

    const decedentMiddleName = {
      name: 'decedentMiddleName',
      valueString: this.dcrForm.controls.decedentInfo.controls.middleName.value ?? ""
    };
    parameters.push(decedentMiddleName);

    const decedentLastName = {
      name: 'decedentLastName',
      valueString: this.dcrForm.controls.decedentInfo.controls.lastName.value
    };
    parameters.push(decedentLastName);

    const decedentRaceCheck = this.dcrForm.controls.decedentInfo.controls.race.controls.raceCheck.value;

    if (decedentRaceCheck.find(value => !!value)) {
      const selectedRace = this.dcrForm.controls.decedentInfo.controls.race.controls.raceCheck.controls
        ?.map((control, index) => control.value ? this.RACE_CATEGORIES.slice(0, 5)[index].display : null)
        .filter(value => value !== null);

      selectedRace.forEach(race => {
        const raceParam = {name: 'decedentRace', valueString: race};
        parameters.push(raceParam);
      });
    } else {
      if (this.dcrForm.controls.decedentInfo.controls.race.controls.raceRadio.value?.['display'] == 'Other') {
        const decedentRace = {
          name: 'decedentRace',
          valueString: this.dcrForm.controls.decedentInfo.controls.race.controls.description.value
        };
        parameters.push(decedentRace);
      } else {
        const decedentRace = {
          name: 'decedentRace',
          valueString: this.dcrForm.controls.decedentInfo.controls.race.controls.raceRadio.value?.['display']
        };
        parameters.push(decedentRace);
      }
    }

    const decedentEthnicity = {
      name: 'decedentEthnicity',
      valueString: this.dcrForm.controls.decedentInfo.controls.ethnicity.value?.['display']
    };
    parameters.push(decedentEthnicity);

    return parameters;
  }

  private getDateStr(dateString: string) {
    if (!dateString) {
      return '';
    }
    try {
      const date = new Date(dateString);
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Month is 0-indexed
      const day = date.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${day}`;
    } catch (error) {
      console.error('Error parsing date string:', error);
      return null;
    }
  }

  private getTimeStr(timeStr: string) {
    if (!timeStr) {
      return '';
    }
    try {
      const date = new Date(timeStr);
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      const seconds = date.getSeconds().toString().padStart(2, '0');
      return `${hours}:${minutes}:${seconds}`;
    } catch (error) {
      console.error('Error parsing date string:', error);
      return null;
    }
  }

  onFormClear() {
    this.dcrForm.reset();
    this.formDirective.resetForm();
    this.placeOfDeath.setErrors(null);
    this.dcrForm.controls.decedentInfo.controls.ethnicity.setErrors(null);
    this.dcrForm.controls.decedentInfo.controls.race.setErrors(null);
  }
}
