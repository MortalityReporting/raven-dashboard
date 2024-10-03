export class ComparisonModel {
  documentType: ComparisonDocumentType;
  entities: ComparisonEntity[];
}

export class ComparisonEntity {
  entityName: string;
  discriminator: EntityDiscriminator;
  list?: boolean = false;
  fields: ComparisonField[];
}

export class ComparisonField {
  label: string;
  type?: ComparisonFhirType;
  list?: boolean = false;
  path?: string;
  discriminator?: FieldDiscriminator;
  specialRule?: string; // TODO: Create enum once set.
}

class Discriminator {}

export class EntityDiscriminator extends Discriminator {
  root?: boolean = false;
  profile?: string;
}

export class FieldDiscriminator extends Discriminator {
  path: string;
  value: string;
}

export enum ComparisonDocumentType {
  MDI_AND_EDRS = "MDI-and-EDRS Document Bundle",
  TOX_TO_MDI = "Tox-to-MDI Message Bundle"
}

export enum ComparisonFhirType {
  ADDRESS = "Address",
  CODE = "code",
  HUMAN_NAME = "HumanName",
  STRING = "string"
}
