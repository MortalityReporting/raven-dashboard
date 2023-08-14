export class EventItem {
  constructor(item: any) {
    this.linkId = item.linkId;
    this.name = item.text;
    this.code = item.code[0].code;
  }

  setStatus(status: string) {
    this.status = status;
  }

  name: string;
  linkId: string;
  code: string;
  status?: string;
}
