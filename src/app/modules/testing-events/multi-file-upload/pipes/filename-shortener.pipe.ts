import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filenameShortener'
})

export class FilenameShortenerPipe implements PipeTransform {

  transform(value: string, maxLength: number = 15): string {
    if (!value) {
      return '';
    }

    const lastDotIndex = value.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return this.truncateMiddle(value, maxLength);
    }

    const filename = value.substring(0, lastDotIndex);
    const extension = value.substring(lastDotIndex);

    return this.truncateMiddle(filename, maxLength) + extension;
  }

  private truncateMiddle(str: string, maxLength: number): string {
    if (str.length <= maxLength) {
      return str;
    }

    const frontLength = Math.floor(maxLength / 2);
    const backLength = maxLength - frontLength;
    return str.slice(0, frontLength) + '...' + str.slice(str.length - backLength);
  }
}
