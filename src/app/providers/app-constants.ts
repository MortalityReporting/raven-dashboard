// Use this file to modify profile defining URLs.
import {Injectable} from "@angular/core";

@Injectable()
export class AppConstants {
  //API_strings
  COMPOSITION_IT_DOCUMENT_OPERATION_DEFINITION = "OperationDefinition/Composition-it-document";
  COMPOSITION_$DOCUMENT = "Composition/$document";

  // USER ROLES
  USER_ROLES = {
    ADMIN: "admin",
  };

  VALUE_NOT_FOUND= "VALUE NOT FOUND";

  // https://hl7.org/fhir/us/vrdr/STU3/ValueSet-vrdr-manner-of-death-vs.html
  MANNER_OF_DEATH_LIST = [
    { code: 38605008, display: "Natural death" },
    { code: 7878000, 	display: "Accidental death" },
    { code: 44301001, display: "Suicide" },
    { code: 27935005, display: "Homicide" },
    { code: 185973002, display: "Patient awaiting investigation" },
    { code: 65037004, display: "Death, manner undetermined" }
  ]

}
