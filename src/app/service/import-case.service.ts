import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ImportCaseService {

  // API url
  baseApiUrl = "https://some.url"

  constructor(private http:HttpClient) { }

  uploadFile(file):Observable<any> {

    const formData = new FormData();

    formData.append("file", file, file.name);

    return this.http.post(this.baseApiUrl, formData)
  }
}
