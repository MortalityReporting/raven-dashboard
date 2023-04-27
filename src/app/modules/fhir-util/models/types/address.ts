import {FhirResource} from "../base/fhir.resource";
import {FhirType} from "../base/fhir.type";

export class Address implements FhirType {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;

  toString(): string {
    let addressString: string = "";
    Object.keys(this).map(key => {
      if (this[key]) addressString += this[key] + ", ";
    });
    addressString = addressString.substring(0, addressString.length - 2)
    return addressString;
  }

  constructor(resource?: FhirResource) {
    if (!resource?.["address"]) return;
    const addressElement = resource?.['address']?.[0];
    this.line1 = addressElement?.line?.[0] || undefined;
    this.line2 = addressElement?.line?.[1] || undefined;
    this.city = addressElement?.city || undefined;
    this.state = addressElement?.state || undefined;
    this.zip = addressElement?.postalCode || undefined;
    this.country = addressElement?.country || undefined;
  }
}
