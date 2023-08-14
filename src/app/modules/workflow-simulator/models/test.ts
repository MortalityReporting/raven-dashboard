import {TestStatus} from "../../testing-events";

export interface Test {
  name: string;
  display: string;
  description: string;
  status: TestStatus;
}
