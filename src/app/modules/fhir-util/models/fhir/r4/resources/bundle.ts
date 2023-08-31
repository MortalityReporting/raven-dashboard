import {FhirResource} from "../base/fhir.resource";
import {Identifier} from "../types/identifier";
import {BackboneElement} from "../base/fhir.backbone-element";
import {Signature} from "../types/signature";
import {HTTPVerb} from "../value-sets/http-verb";

export class Bundle implements FhirResource {
  resourceType: string = "Bundle";
  identifier?: Identifier;
  type: BundleType;
  timestamp?: string; // Uri Type
  total?: number; // Unsigned Int Type
  link?: LinkComponent[];
  entry?: BundleEntryComponent[];
  signature?: Signature; // TODO
}

export class LinkComponent extends BackboneElement {
  relation: string;
  url: string; // Uri Type
}

export class BundleEntryComponent extends BackboneElement{
  link?: LinkComponent;
  fullUrl?: string;
  resource?: FhirResource;
  search?: SearchComponent;
  request?: RequestComponent; // TODO
  response?: ResponseComponent; // TODO
}

export class SearchComponent extends BackboneElement {
  mode?: string; // Code Type
  score?: number; // Decimal Type
}

export class RequestComponent extends BackboneElement {
  method: HTTPVerb;
  url: string; // Uri Type
  ifNoneMatch?: string;
  ifModifiedSince?: string; // Instant Type
  ifMatch?: string;
  ifNoneExist?: string;
}

export class ResponseComponent extends BackboneElement {
  status: string;
  location?: string; // Uri Type
  etag?: string;
  lastModified?: string; // Instant Type
  outcome?: FhirResource; // OperationOutcome
}

export enum BundleType {
  document= "document",
  message = "message",
  transaction = "transaction",
  transactionResponse = "transaction-response",
  batch = "batch",
  batchResponse = "batch-response",
  history = "history",
  searchset = "searchset",
  collection = "collection",
  subscriptionNotification = "subscription-notification"
}
