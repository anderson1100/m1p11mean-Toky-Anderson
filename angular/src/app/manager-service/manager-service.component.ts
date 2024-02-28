import { Component, ViewChild } from '@angular/core';
import {DropzoneComponent} from 'ngx-dropzone-wrapper';
import { DropzoneModule } from 'ngx-dropzone-wrapper';

@Component({
  selector: 'app-manager-service',
  standalone: true,
  imports: [
    DropzoneModule
  ],
  templateUrl: './manager-service.component.html',
  styleUrl: './manager-service.component.css'
})
export class ManagerServiceComponent {
  //@ViewChild(DropzoneComponent) dropzone: DropzoneComponent;
  //@ViewChild(DropzoneComponent, { static: false }) dropzone!: DropzoneComponent;

  dropzoneConfig = {
    url: 'your-upload-url',
    maxFilesize: 50,
    acceptedFiles: 'image/*',
    autoProcessQueue: false,
    addRemoveLinks: true,
    maxFiles: 1,
    headers: {
      'Authorization': 'Bearer your-token'
    }
  };

  onFileChange(event: any) {
    const files = event.target.files || event.dataTransfer.files;
    if (!files.length) {
      return;
    }

    const formData = new FormData();
    formData.append('file', files[0]);
  }
}
