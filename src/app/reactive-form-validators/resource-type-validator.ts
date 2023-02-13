import {AbstractControl} from '@angular/forms';

export function ResourceTypeValidator(control: AbstractControl) {
  if (control.value == null) {
    return null;
  }

  let hasErrors = false;
  let json = null;
  try {
    json = JSON.parse(control.value.trim());
  } catch (e) {
    hasErrors = true;
  }

  if (!json?.resourceType) {
    hasErrors = true;
  }

  if (hasErrors) {
    return {resourceTypeValidator: true};
  }
  return null
}
