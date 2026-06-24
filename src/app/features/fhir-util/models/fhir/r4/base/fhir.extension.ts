import {FhirElement} from "./fhir.element";
import {Address} from "../types/address";
import {CodeableConcept} from "../types/codeable-concept";
import {Coding} from "../types/coding";
import {Identifier} from "../types/identifier";
import {Attachment} from "../types/attachment";


const rule_1 = "An extension SHALL have either a value (i.e. a value[x] element) or sub-extensions, but not both. If" +
  "present, the value[x] element SHALL have content (value attribute or other elements)";

export class Extension extends FhirElement {
  url: string;

  valueAddress?: Address;
  valueBoolean?: boolean;
  valueCode?: string;
  valueCodeableConcept?: CodeableConcept;
  valueCoding?: Coding;
  valueIdentifier?: Identifier;
  valueString?: string;
  valueAttachment?: Attachment;
}


// valueBase64Binary: base64Binary
// valueCanonical: canonical
// valueDate: date
// valueDateTime: dateTime
// valueDecimal: decimal
// valueId: id
// valueInstant: instant
// valueInteger: integer
// valueInteger64: integer64
// valueMarkdown: markdown
// valueOid: oid
// valuePositiveInt: positiveInt
// valueTime: time
// valueUnsignedInt: unsignedInt
// valueUri: uri
// valueUrl: url
// valueUuid: uuid
// valueAddress: Address
// valueAge: Age
// valueAnnotation: Annotation
// valueAttachment: Attachment
// valueCodeableReference: CodeableReference
// valueCoding: Coding
// valueContactPoint: ContactPoint
// valueCount: Count
// valueDistance: Distance
// valueDuration: Duration
// valueHumanName: HumanName
// valueIdentifier: Identifier
// valueMoney: Money
// valuePeriod: Period
// valueQuantity: Quantity
// valueRange: Range
// valueRatio: Ratio
// valueRatioRange: RatioRange
// valueReference: Reference - a reference to another resource
// valueSampledData: SampledData
// valueSignature: Signature
// valueTiming: Timing
// valueContactDetail: ContactDetail
// valueDataRequirement: DataRequirement
// valueExpression: Expression
// valueParameterDefinition: ParameterDefinition
// valueRelatedArtifact: RelatedArtifact
// valueTriggerDefinition: TriggerDefinition
// valueUsageContext: UsageContext
// valueAvailability: Availability
// valueExtendedContactDetail: ExtendedContactDetail
// valueDosage: Dosage
// valueMeta: Meta
