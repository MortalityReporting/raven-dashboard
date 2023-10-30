export class RegistrationDisplay {
  title: string;
  items: RegistrationDisplayItem[] = [];
}

export class RegistrationDisplayItem {
  linkId: string;
  eventTitle: string;
  description: string;
  testName: string;
  testCode: string;
  testStatus: string;
}
