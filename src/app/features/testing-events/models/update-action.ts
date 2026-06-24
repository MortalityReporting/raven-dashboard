import {TestStatusCodes} from "./test-status";

// This is a simple model to standardize the body passed through the event test update status methods.
export class UpdateAction {
  status: TestStatusCodes
  attachment?: string
}
