import {FhirResource} from "../../fhir-util";
import {v4 as uuid} from 'uuid';

export class UserProfile {
  constructor() {
    // Use the factory constructors to build a UserProfile.
  }

  static constructFromStrings(name: string, email: string): UserProfile {
    let userProfile = new UserProfile();
    userProfile.fhirId = uuid();
    userProfile.id = uuid();
    userProfile.name = name;
    userProfile.email = email;
    return userProfile;
  }

  static constructFromFHIR(practitioner: FhirResource): UserProfile {
    let userProfile = new UserProfile();
    userProfile.fhirId = practitioner?.['id'];
    userProfile.id = practitioner?.['identifier']?.[0]?.value;
    userProfile.name = practitioner?.['name']?.[0]?.text;
    userProfile.email = practitioner?.['telecom']?.[0]?.value;
    return userProfile;
  }

  fhirId?: string;
  id?: string;
  name?: string;
  email?: string;

  generateId(overwrite: boolean = false) {
    if (!this.id) this.id = uuid();
    else if (overwrite) this.id = uuid();
    else {
      console.error("User ID is not null and overwrite is not specified.")
    }
  }

  toFhirJSON(): any {
    // TODO: Add error handling if not all fields exist.
    return {
      "resourceType": "Practitioner",
      "meta": {"profile": ["http://raven-user"]},
      "id": this.fhirId,
      "identifier": [
        {
          "type": {
            "coding": [ {
              "system": "https://heat.icl.gtri.org/hapi-fhir-public/fhir/CodeSystem/624454",
              "code": "raven-user"
            } ],
            "text": "Raven User"
          },
          "value": this.id
        }
      ],
      "active": true,
      "name": [ {
        "text": this.name
      } ],
      "telecom": [ {
        "system": "email",
        "value": this.email
      } ]
    }
  }
}
