import {Injectable} from "@angular/core";

@Injectable()
export class Fields {

  deathLocation: FieldConfig = {
    title: "location of Death",
    profile: "Location - Death",
    fhirPath: "Location.name"
  }

  injuryLocation: FieldConfig = {
    title: "Location of Injury",
    profile: "Location - Injury",
    fhirPath: "Location.name"
  }

}


export class FieldConfig {
  title: string;
  profile: string;
  fhirPath: string;
}
