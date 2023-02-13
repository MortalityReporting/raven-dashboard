import {AbstractControl} from '@angular/forms';

export function JsonValidator(control: AbstractControl) {
  if (control.value == null) {
    return null;
  }
  let hasErrors = false;
  try {
    JSON.parse(control.value.trim());
  } catch (e) {
    hasErrors = true;
  }
  if (hasErrors) {
    return {jsonValidator: true};
  }
  return null
}
