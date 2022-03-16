import { Injectable } from '@angular/core'

@Injectable()
export class ValidatorConstants {

  ErrorMessages = {
    INVALID_VALUE: "Missing or invalid value"
  }

  FormErrorMessages = {
    FIELD_REQUIRED: "This field is required"
  }

}
