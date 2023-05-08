import {FhirElement} from "./fhir.element";
import {CodeableConcept} from "../types/codeable.concept";
import {Coding} from "../types/coding";
import {CodeType, StringType} from "./fhir.primitives";
import {Address} from "../types/address";
import {Identifier} from "../types/identifier";

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

  constructor(
      url: string,
      value: StringType | CodeType,
      extensions?: Extension[]
  ) {
    if (extensions) super(extensions);
    else super();
    this.url = url;
    if (value instanceof StringType) this.valueString = value.value;
    else if (value instanceof CodeType) this.valueCode = value.value;
  }

  validate() {}

  public getUrl(): string {
    return this.url;
  }
  public getValue(): any {
    return this[Object.keys(this).find(key => key.startsWith("value"))];
  }
  public getExtensions(): Extension[] {
    return this.extension;
  }
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
