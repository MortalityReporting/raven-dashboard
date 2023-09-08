export class TemplateContent {
  uri: string;
  contentType: string;
  fileExtension: string;
}
export interface FileTemplate {
  description: string;
  apiImportParameter: string;
  templateContent: TemplateContent[];
}
