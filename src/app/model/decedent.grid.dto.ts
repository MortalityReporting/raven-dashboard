export class DecedentGridDTO {
  index: number;
  decedentId: number | string;
  firstName: string;
  lastName: string;
  gender: string;
  tod: Date;
  age: number;
  system: string;
  status: string;
  mannerOfDeath: string;
  patientResource: any;
  caseNumber: string | null = null;
}
