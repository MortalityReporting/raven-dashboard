export class ToxicologyGridDto {
  index: number;
  firstName: string;
  lastName: string;
  reportdate: Date;
  toxcasenumber: string;
  toxcasesystem: string;
  mdicasenumber?: string;
  mdicasesystem?: string;
  error?: boolean = false;
}
