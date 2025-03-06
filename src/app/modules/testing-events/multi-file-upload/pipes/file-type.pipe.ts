import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'fileType'
})

export class FileTypePipe implements PipeTransform {

  transform(file: File, allowedTypes: string[]): string | null {
    if (!file || !file.name) {
      return null;
    }

    const fileExtension = file.name.substring(file.name.lastIndexOf('.') + 1)
    const isValid = allowedTypes.includes(fileExtension);

    return isValid ? null : fileExtension;
  }

}
