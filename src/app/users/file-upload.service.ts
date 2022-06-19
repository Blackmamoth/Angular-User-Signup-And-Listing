import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadServices {


  baseUrl: string = 'http://localhost:5000/api/media/upload';

  constructor(private http: HttpClient) { }

  uploadImage(file) {
    const formData = new FormData();
    formData.append('file', file, file.name)
    return this.http.post(this.baseUrl, formData);
  }

}
