import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { FileUploadServices } from '../file-upload.service';

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.css']
})
export class MediaUploadComponent implements OnInit {

  userData = JSON.parse(localStorage.getItem('userData'))

  alertState: string = 'success'
  alertMessage: string = null;
  showAlert: boolean = false;
  loading: boolean = false;

  mediaForm: FormGroup;

  imageFile: File;
  imgSrc: string = "img/sample_content/upload-250x150.png";
  videoFile: File;
  videoSrc: string = 'img/sample_content/upload-250x150.png';
  documentFile: File;
  documentSrc: string = 'img/sample_content/upload-250x150.png';

  imageName: string = null;
  videoName: string = null;
  documentName: string = null;
  documentFileName: string = null;

  userDocumentPresent: boolean = false;

  imageUrl: string;
  videoUrl: string;
  documentUrl: string;

  constructor(private mediaService: FileUploadServices, private router: Router) { }

  ngOnInit(): void {

    this.mediaService.getImage(this.userData._id).subscribe(data => {
      if (data?.name) {
        this.imgSrc = `/uploads/images/${data.name}`
      }
    })

    this.mediaService.getVideo(this.userData._id).subscribe(data => {
      if (data?.name) {
        this.videoSrc = `/uploads/videos/${data.name}`
      }
    })

    this.mediaService.getDocument(this.userData._id).subscribe(data => {
      if (data?.filename) {
        this.documentFileName = data.filename
        this.userDocumentPresent = true
      }
    })

    this.mediaForm = new FormGroup({
      'profilePic': new FormControl(null),
      'someVideo': new FormControl(null),
      'someDocument': new FormControl(null)
    })
    this.imageUpdate()
    this.videoUpdate()
    this.documentUpdate()
  }

  onCancel() {
    if (this.mediaForm.touched) {
      const proceed = confirm('Are you sure you want to discard these changes?')
      if (!proceed) {
        return;
      }
    }
    this.router.navigate([''])
  }

  onChangeImage(event) {
    const files = event.target.files
    this.imageFile = files[0]
    this.imgSrc = URL.createObjectURL(files[0])
  }

  removeImage() {
    this.imageFile = null;
    this.imgSrc = 'img/sample_content/upload-250x150.png'
  }

  onChangeVideo(event) {
    const files = event.target.files
    this.videoFile = files[0]
    this.videoSrc = URL.createObjectURL(files[0])
  }

  removeVideo() {
    this.videoFile = null;
    this.videoSrc = 'img/sample_content/upload-250x150.png'
  }

  onChangeDocument(event) {
    const files = event.target.files
    this.documentFile = files[0]
    this.documentFileName = files[0].name
  }

  removeDocument() {
    this.documentFile = null;
  }


  onUpload() {
    if (this.imageFile) {
      this.loading = true
      this.mediaService.uploadImage(this.imageFile).subscribe(response => {
        if (!response.success) {
          this.alertMessage = 'Error, Something went wrong'
          this.alertState = 'danger'
        } else {
          this.alertMessage = 'Success, File uploaded successfully'
          this.alertState = 'success'
          this.imageUpdate();
        }
        this.loading = false;
        this.showAlert = true
        setTimeout(() => this.showAlert = false, 5000)
      })
    }
    if (this.videoFile) {
      this.loading = true
      this.mediaService.uploadVideo(this.videoFile).subscribe(response => {
        if (!response.success) {
          this.alertMessage = 'Error, Something went wrong'
          this.alertState = 'danger'
        } else {
          this.alertMessage = 'Success, File uploaded successfully'
          this.alertState = 'success'
          this.videoUpdate();
        }
        this.loading = false
        this.showAlert = true
        setTimeout(() => this.showAlert = false, 5000)
      })
    }
    if (this.documentFile) {
      this.loading = true
      this.mediaService.uploadDocument(this.documentFile).subscribe(response => {
        if (!response.success) {
          this.alertMessage = 'Error, Something went wrong'
          this.alertState = 'danger'
        } else {
          this.alertMessage = 'Success, File uploaded successfully'
          this.alertState = 'success'
          this.documentUpdate();
        }
        this.loading = false
        this.showAlert = true
        setTimeout(() => this.showAlert = false, 5000)
      })
    }
    this.mediaForm.reset()
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
