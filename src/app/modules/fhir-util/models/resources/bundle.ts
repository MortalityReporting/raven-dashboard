import {FhirResource} from "../base/fhir.resource";

export class Bundle implements FhirResource {
  resourceType: string = "Bundle";
  link?: any; // TODO
  type: BundleType;
  total: number;
  entry?: BundleEntryComponent[];
}

export class BundleEntryComponent {
  link?: any; // TODO
  fullUrl?: string;
  resource?: FhirResource;
  request?: any; // TODO
  response?: any; // TODO
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
