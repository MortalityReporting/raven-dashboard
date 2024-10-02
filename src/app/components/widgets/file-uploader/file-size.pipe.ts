import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'fileSize'
})
export class FileSizePipe implements PipeTransform {

  transform(value: number): string {
    if (value === 0) {
      return '0 Bytes';
    }

    const k = 1024;
    const sizes = ['bytes', 'KB', 'MB', 'GB'];

    const i = Math.floor(Math.log(value) / Math.log(k));
    if(sizes.length >= i){
      console.error("File size is too large for processing");
      return '';
    }
    return (value / Math.pow(k, i)).toFixed(0) + ' ' + sizes[i];
  }
}
