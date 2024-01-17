/*
 * https://hl7.org/fhir/r4/datatypes.html#attachment
 */


import {FhirType} from "../base/fhir.type";
import {FhirElement} from "../base/fhir.element";
import {Base64Binary, Code, DateTime, UnsignedInt, Uri} from "../base/fhir.primitive";

export class Attachment extends FhirType {
  contentType?: Code; // TODO: MimeTypes VS
  _contentType?: FhirElement;
  // contentType VS = https://hl7.org/fhir/r4/valueset-mimetypes.html (REQ)
  language?: Code;
  _language?: FhirElement;
  // language VS = https://hl7.org/fhir/r4/valueset-languages.html (PREF)
  //             = https://hl7.org/fhir/r4/valueset-all-languages.html (LIMITED TO)
  data?: Base64Binary<any>;
  _data?: FhirElement;
  url?: Uri;
  _url?: FhirElement;
  size?: UnsignedInt;
  _size?: FhirElement;
  hash?: Base64Binary<any>;
  _hash?: FhirElement;
  title?: string;
  _title?: FhirElement;
  creation?: DateTime;
  _creation?: FhirElement;
}
