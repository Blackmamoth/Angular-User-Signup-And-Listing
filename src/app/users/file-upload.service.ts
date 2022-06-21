import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FileUploadServices {


  baseUrl: string = '/api/media';

  constructor(private http: HttpClient) { }

  uploadImage(file): any {
    const formData = new FormData();
    formData.append('file', file, file.name)
    return this.http.patch(`${this.baseUrl}/uploadImg`, formData);
  }

  uploadVideo(file): any {
    const formData = new FormData();
    formData.append('file', file, file.name)
    return this.http.patch(`${this.baseUrl}/uploadVid`, formData)
  }

  uploadDocument(file): any {
    const formData = new FormData();
    formData.append('file', file, file.name)
    return this.http.patch(`${this.baseUrl}/uploadDoc`, formData)
  }

  getImage(id): any {
    return this.http.post(`${this.baseUrl}/retrieveImg`, { id })
  }

  getVideo(id): any {
    return this.http.post(`${this.baseUrl}/retrieveVid`, { id })
  }

  getDocument(id): any {
    return this.http.post(`${this.baseUrl}/retrieveDoc`, { id })
  }

  downloadDocument(url): any {
    return this.http.get(url)
  }

} 
