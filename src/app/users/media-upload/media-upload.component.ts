import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { FileUploadServices } from '../file-upload.service';

@Component({
  selector: 'app-media-upload',
  templateUrl: './media-upload.component.html',
  styleUrls: ['./media-upload.component.css']
})
export class MediaUploadComponent implements OnInit {

  mediaForm: FormGroup;

  file: File;

  constructor(private mediaService: FileUploadServices) { }

  ngOnInit(): void {
    this.mediaForm = new FormGroup({
      'profilePic': new FormControl(null, Validators.required),
      'someVideo': new FormControl(null, Validators.required),
    })
  }

  onChange(event) {
    this.file = event.target.files[0]
    console.log(this.file)
  }

  onUpload() {
    this.mediaService.uploadImage(this.file).subscribe(response => {
      console.log(response)
    })
  }

}
