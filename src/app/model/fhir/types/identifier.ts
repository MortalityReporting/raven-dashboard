import {Period} from "./period";
import {CodeableConcept} from "./codeable.cocept";

export class Identifier {
  use: string;
  type: CodeableConcept;
  system: string;
  value: string;
  period: Period;
}
