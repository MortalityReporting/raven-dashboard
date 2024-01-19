import {TestStatusCodes} from "../../testing-events";

export interface Test {
  name: string;
  display: string;
  description: string;
  status: TestStatusCodes;
  route?: string
}
