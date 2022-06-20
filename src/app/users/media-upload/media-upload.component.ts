import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploadServices } from '../file-upload.service';

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.css']
})
export class MediaUploadComponent implements OnInit {

  userData = JSON.parse(localStorage.getItem('userData'))


  mediaForm: FormGroup;

  imageFile: File;
  videoFile: File;

  imageName: string = null;
  videoName: string = null;

  imageUrl: string;
  videoUrl: string;

  allowedImageExtensions: string[] = ['jpg', 'png', 'jpeg', 'jiff', 'svg']
  allowedVideoExtensions: string[] = ['mp4', 'mov', 'wmv', 'flv', 'avi']

  constructor(private mediaService: FileUploadServices) { }

  ngOnInit(): void {
    this.mediaForm = new FormGroup({
      'profilePic': new FormControl(null, [this.allowedImageExtension.bind(this)]),
      'someVideo': new FormControl(null, [this.allowedVideoExtension.bind(this)]),
    })
    this.imageUpdate()
    this.videoUpdate()
  }

  onChangeImage(event) {
    const files = event.target.files
    this.imageFile = files[0]
  }

  onChangeVideo(event) {
    const files = event.target.files
    this.videoFile = files[0]
  }

  onUpload() {
    if (this.imageFile) {

      this.mediaService.uploadImage(this.imageFile).subscribe(response => {
        this.imageUpdate();
      })
    }
    if (this.videoFile) {
      this.mediaService.uploadVideo(this.videoFile).subscribe(response => {
        this.videoUpdate()
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



}
