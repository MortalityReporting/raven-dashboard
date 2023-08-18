import {Pipe, PipeTransform, SecurityContext} from '@angular/core';
import {map, Observable} from "rxjs";
import {DomSanitizer, SafeResourceUrl, SafeValue} from "@angular/platform-browser";
import {HttpClient} from "@angular/common/http";

@Pipe({
  name: 'sanitized'
})
export class SanitizedUrlPipe implements PipeTransform {
  constructor(private readonly http: HttpClient,
              private readonly sanitizer: DomSanitizer) {}

  // TODO: Get this working in order to properly sanitize pdfs, etc in the preview of document window.
  transform(file: File): Observable<any> {
    return this.http
      .get(this.sanitizer.sanitize(SecurityContext.NONE, file))
      .pipe(
        map(
          (val: any) => {
            this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(val))
          }));
  }

}
