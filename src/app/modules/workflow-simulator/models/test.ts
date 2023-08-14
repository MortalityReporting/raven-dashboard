import {TestStatus} from "../../testing-events";

export class Test {
  name: string;
  displayName: string;
  description: string;
  status: TestStatus;
  sortOrder: number;
  constructor(name: string, displayName, sortOder: number, description: string, status?: TestStatus ){
    this.name = name;
    this.displayName = displayName;
    this.description = description;
    this.status = status ?? TestStatus.notStarted;
    this.sortOrder = sortOder
  }
}
