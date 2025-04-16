import {FhirResource} from "../base/fhir.resource";
import {FhirType} from "../base/fhir.type";

export class Address extends FhirType {
  line1: string;
  line2: string;
  city: string;
  state: string;
  zip: string;
  country: string;

  override toString(): string {
    let addressString: string = "";
    Object.keys(this).map(key => {
      if (this[key]) addressString += this[key] + ", ";
    });
    addressString = addressString.substring(0, addressString.length - 2)
    return addressString;
  }

  constructor(resource?: FhirResource) {
    super();
    if (!resource?.["address"]) return;
    let addressElement = null;
    if(resource?.["address"]?.length){
      addressElement = resource?.['address']?.[0]
    } else {
      addressElement = resource?.['address'];
    }
    this.line1 = addressElement?.line?.[0] || undefined;
    this.line2 = addressElement?.line?.[1] || undefined;
    this.city = addressElement?.city || undefined;
    this.state = addressElement?.state || undefined;
    this.zip = addressElement?.postalCode || undefined;
    this.country = addressElement?.country || undefined;
  }
}
