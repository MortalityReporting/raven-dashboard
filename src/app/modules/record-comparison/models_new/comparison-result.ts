import {FhirResource} from "../../fhir-util";
import {ComparisonEntity, ComparisonField, ComparisonModel} from "./comparison-model";

export class ComparisonResult {
  constructor(userRecord: FhirResource, comparisonRecord: FhirResource, comparisonModel: ComparisonModel) {
    this.metadata = new ComparisonResultMetadata(userRecord, comparisonRecord, comparisonModel);
    const comparisonResultList: EntityResult[] = [];
    comparisonModel.entities.forEach((entityModel: ComparisonEntity) => {
      comparisonResultList.push(new EntityResult(userRecord, comparisonRecord, entityModel));
    });
    this.entityResults = comparisonResultList;
  }

  metadata: ComparisonResultMetadata;
  entityResults: EntityResult[]
}

/**
 * Stores entire user and comparison bundles, as well as the comparison model.
 * TODO: Trim contents of metadata back as possible once all needs identified.
 */
export class ComparisonResultMetadata {
  constructor(uRecord: FhirResource, cRecord: FhirResource, cModel: ComparisonModel) {
    this.documentType = cModel.documentType;
    this.userRecord = uRecord;
    this.comparisonRecord = cRecord;
    this.comparisonModel = cModel;
  }

  documentType: string;
  userRecord: FhirResource;
  comparisonRecord: FhirResource;
  comparisonModel: ComparisonModel;
}

export class EntityResult {
  constructor(uRecord: FhirResource, cRecord: FhirResource, eModel: ComparisonEntity) {
    // TODO: Implement comparison logic.
    this.entityName = eModel.entityName;
    const fieldResultList: FieldResult[] = []
    eModel.fields.forEach((fModel: ComparisonField) => {
      fieldResultList.push(new FieldResult("u", "c", fModel));
    });
    this.fields = fieldResultList;
  }
  entityName: string;
  fields: FieldResult[];
}

export class FieldResult {
  constructor(u: any, c: any, fModel: ComparisonField) {
    this.label = fModel.label;
  }
  label: string;
}
