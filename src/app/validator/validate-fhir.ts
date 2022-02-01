import {AbstractControl} from '@angular/forms';

export function ValidateFhir(control: AbstractControl) {

  if (control.value == null) {
    return null;
  }
  console.log(control.value)
  const getRandomBoolean = () => Math.random() >= 0.5;

  let randomBoolean = getRandomBoolean();
  if (randomBoolean) {
    return {fhirValidator: true};
  }
  return null;
}
