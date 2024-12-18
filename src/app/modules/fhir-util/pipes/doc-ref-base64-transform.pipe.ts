import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'docrefBase64',
    standalone: false
})
export class DocRefBase64TransformPipe implements PipeTransform {

  placeholder = "/assets/portrait_placeholder.png";

  transform(fhirResource: any): any {
    if (!fhirResource) { return this.placeholder}
    else {
      const contentType = fhirResource?.content?.[0]?.attachment?.contentType;
      const data = fhirResource?.content?.[0]?.attachment?.data;
      const attachmentContent = `data:${contentType};base64,${data}`;
      return attachmentContent;
    }
  }

}
