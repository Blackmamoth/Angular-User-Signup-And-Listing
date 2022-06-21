import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Form, FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploadServices } from '../file-upload.service';

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.css']
})
export class MediaUploadComponent implements OnInit {

  userData = JSON.parse(localStorage.getItem('userData'))

  success: string[] = [];
  errors: string[] = [];

  mediaForm: FormGroup;

  imageFile: File;
  videoFile: File;
  documentFile: File;

  imageName: string = null;
  videoName: string = null;
  documentName: string = null;

  imageUrl: string;
  videoUrl: string;
  documentUrl: string;

  allowedImageExtensions: string[] = ['jpg', 'png', 'jpeg', 'jiff', 'svg']
  allowedVideoExtensions: string[] = ['mp4', 'mov', 'wmv', 'flv', 'avi', 'mkv']
  allowedDocumentsExtensions: string[] = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'txt', 'csv', 'json']

  constructor(private mediaService: FileUploadServices, private detectChanges: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.mediaForm = new FormGroup({
      'profilePic': new FormControl(null, [this.allowedImageExtension.bind(this)]),
      'someVideo': new FormControl(null, [this.allowedVideoExtension.bind(this)]),
      'someDocument': new FormControl(null, [this.allowedDocumentExtension.bind(this)])
    })
    this.imageUpdate()
    this.videoUpdate()
    this.documentUpdate()
  }

  onChangeImage(event) {
    const files = event.target.files
    this.imageFile = files[0]
  }

  onChangeVideo(event) {
    const files = event.target.files
    this.videoFile = files[0]
  }

  onChangeDocument(event) {
    const files = event.target.files
    this.documentFile = files[0]
  }

  onUpload() {
    if (this.imageFile) {

      this.mediaService.uploadImage(this.imageFile).subscribe(response => {
        if (!response.success) {
          this.errors.push('Error occured while uploading profile pic')
        } else {
          this.success.push('Image upload succcessful')
          this.imageUpdate();
        }
      })
    }
    if (this.videoFile) {
      this.mediaService.uploadVideo(this.videoFile).subscribe(response => {
        if (!response.success) {
          this.errors.push('Error occured while uploading Video')
        } else {
          this.success.push('Video Upload successful')
          this.videoUpdate()
        }
      })
    }
    if (this.documentFile) {
      this.mediaService.uploadDocument(this.documentFile).subscribe(response => {
        if (!response.success) {
          this.errors.push('Error occured while uploading Document')
        } else {
          this.success.push('Document upload successful')
          this.documentUpdate()
        }
      })
    }
    this.mediaForm.reset()
  }

  allowedImageExtension(control: FormControl): { [s: string]: boolean } {
    if (control.value) {
      const ext = control.value.split('.')[1]
      if (!this.allowedImageExtensions.includes(ext)) {
        return { 'extensionNotAllowd': true }
      }
    }
    return null;
  }

  allowedVideoExtension(control: FormControl): { [s: string]: boolean } {
    if (control.value) {
      const ext = control.value.split('.')[1]
      if (!this.allowedVideoExtensions.includes(ext)) {
        return { 'extensionNotAllowd': true }
      }
    }
    return null;
  }

  allowedDocumentExtension(control: FormControl): { [s: string]: boolean } {
    if (control.value) {
      const ext = control.value.split('.')[1]
      if (!this.allowedDocumentsExtensions.includes(ext)) {
        return { 'extensionNotAllowd': true }
      }
    }
    return null;
  }


  imageUpdate() {
    const id = this.userData._id
    this.mediaService.getImage(id).subscribe(image => {
      if (!image) {
        this.imageUrl = `/uploads/images/default.jpg`
        return;
      }
      this.imageName = image.name;
      this.imageUrl = `/uploads/images/${this.imageName}`
    })
  }

  videoUpdate() {
    const id = this.userData._id
    this.mediaService.getVideo(id).subscribe(video => {
      if (!video) {
        return;
      }
      this.videoName = video.name
      this.videoUrl = `/uploads/videos/${this.videoName}`
    })
  }

  documentUpdate() {
    const id = this.userData._id
    this.mediaService.getDocument(id).subscribe(userDocument => {
      if (!userDocument) {
        return;
      }
      this.documentName = userDocument.name
      this.documentUrl = `/uploads/documents/${this.documentName}`
    })
  }

  onDownloadDocument() {
    this.mediaService.downloadDocument(this.documentUrl).subscribe()
  }


}
