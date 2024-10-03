import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'totalFileSize'
})
export class TotalFileSizePipe implements PipeTransform {

  transform(files: File[]): number {
    if (!files || files.length === 0) {
      return 0;
    }

    // Calculate the total size in bytes
    const totalSizeInBytes = files.reduce((total, file) => total + file.size, 0);

    return totalSizeInBytes;
  }
}
