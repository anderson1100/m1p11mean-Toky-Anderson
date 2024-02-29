import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { DropzoneComponent } from 'ngx-dropzone-wrapper';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ManagerService } from '../services/manager.service';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { object } from 'joi';

@Component({
  selector: 'app-manager-personnel',
  standalone: true,
  imports: [DropzoneModule, FormsModule, ReactiveFormsModule, NgxDropzoneModule],
  templateUrl: './manager-personnel.component.html',
  styleUrl: './manager-personnel.component.css'
})
export class ManagerPersonnelComponent implements OnInit {

  constructor(private managerService: ManagerService) {

  }

  ngOnInit(): void {
    this.getListEmploye();
  }

  baseUrl: string = this.managerService.baseUrl

  listEmploye: any[] = [];

  addFormData = new FormData();

  updateFormData = new FormData();

  addForm: FormGroup = new FormGroup({
    nom: new FormControl("Anderson"),
    prenom: new FormControl("Anderson"),
    username: new FormControl("Bulla"),
    email: new FormControl("andersonmahosi@gmail.com", [Validators.required, Validators.email]),
    password: new FormControl("password123", [Validators.required, Validators.minLength(8)]),
    heure_debut: new FormControl("08:00"),
    heure_fin: new FormControl("17:00")
  })

  updateForm: FormGroup = new FormGroup({
    nom: new FormControl(""),
    prenom: new FormControl(""),
    username: new FormControl(""),
    email: new FormControl("", [Validators.required, Validators.email]),
    password: new FormControl("", [Validators.required, Validators.minLength(8)]),
    heure_debut: new FormControl(""),
    heure_fin: new FormControl("")
  })

  addError = signal(false);

  addLoading = signal(false);

  updateError = signal(false);

  updateLoading = signal(true);

  updateRequestLoading = signal(false);

  employeToDelete: any = null;

  deleteLoading = signal(false);

  employeToUpdate: any = null;

  // dropzoneConfig = {
  //   url: 'your-upload-url',
  //   maxFilesize: 50,
  //   acceptedFiles: 'image/*',
  //   autoProcessQueue: false,
  //   addRemoveLinks: true,
  //   maxFiles: 1,
  //   headers: {
  //     'Authorization': 'Bearer your-token'
  //   }
  // };

  getTime(dateString: string) {
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2, '0'); // Get hours and pad with leading zero if needed
    const minutes = date.getMinutes().toString().padStart(2, '0'); // Get minutes and pad with leading zero if needed
    return `${hours}:${minutes}`;
  }

  getListEmploye() {
    this.managerService.getEmployes().subscribe({
      next: (data: any) => {
        this.listEmploye = data;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  deleteEmploye() {
    //this.addLoading.set(true);
    console.log("delete function")
    if (this.employeToDelete) {
      console.log("employeToDelete exists")
      this.listEmploye.splice(this.employeToDelete.index, 1);
      this.managerService.deleteEmploye(this.employeToDelete._id).subscribe({
        next: (data: any) => {
          console.log("deleted");
          this.employeToDelete = null;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  openDeleteModal(index: any) {
    console.log("on open delete");
    this.employeToDelete = this.listEmploye[index];
    this.employeToDelete.index = index;
  }

  openUpdateModal(index: any) {
    console.log("open modal update");
    this.updateFiles = [];
    this.updateLoading.set(true);
    this.employeToUpdate = this.listEmploye[index];
    this.employeToUpdate.index = index;
    console.log(this.employeToUpdate);
    this.updateForm = new FormGroup({
      nom: new FormControl(this.employeToUpdate.nom),
      prenom: new FormControl(this.employeToUpdate.prenom),
      username: new FormControl(this.employeToUpdate.username),
      email: new FormControl(this.employeToUpdate.email, [Validators.required, Validators.email]),
      password: new FormControl(this.employeToUpdate.password, [Validators.required, Validators.minLength(8)]),
      heure_debut: new FormControl("08:00"),
      heure_fin: new FormControl("18:00")
    });
    this.updateLoading.set(false);
    console.log(this.employeToUpdate);
  }

  createDateTimeStringFromHours(hours: any) {
    const [hourStr, minuteStr] = hours.split(':');
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;
    return `${dateString}T${hourStr}:${minuteStr}:00`;
  }


  files: File[] = [];

  onSelect(event: any) {
    this.files = [];
    //console.log(event);
    this.files.push(...event.addedFiles);
    this.addFormData.append("photo", this.files[0]);
  }

  onRemove(event: any) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    this.addFormData.delete("photo");
  }

  addEmploye() {
    //console.log("add employe")
    this.addError.set(false);
    this.addLoading.set(true);
    const controlNames = Object.keys(this.addForm.controls);
    for (let i = 0; i < controlNames.length; i++) {
      const controlName = controlNames[i];
      const control = this.addForm.get(controlName);
      if (control) {
        this.addFormData.delete(controlName);
        if (controlName === "heure_debut" || controlName === "heure_fin") {
          this.addFormData.append(controlName, this.createDateTimeStringFromHours(control.value))
        } else {
          this.addFormData.append(controlName, control.value);
        }
      }
    }
    //console.log(this.addFormData);
    this.managerService.addEmploye(this.addFormData).subscribe({
      next: (data: any) => {
        this.getListEmploye();
      },
      error: (error) => {
        console.log(error);
        this.addLoading.set(false);
        this.addError.set(true);

      },
      complete: () => {
        this.getListEmploye();
        this.addLoading.set(false);
      }
    })
  }

  updateFiles: File[] = [];

  onSelectUpdateImage(event: any) {
    this.updateFiles = [];
    //console.log(event);
    this.updateFiles.push(...event.addedFiles);
    this.updateFormData.append("photo", this.updateFiles[0]);
  }

  onRemoveUpdateImage(event: any) {
    //console.log(event);
    this.updateFiles.splice(this.updateFiles.indexOf(event), 1);
    this.updateFormData.delete("photo");
  }


  updateEmploye() {
    //console.log("add employe")
    this.updateError.set(false);
    this.updateRequestLoading.set(true);
    const controlNames = Object.keys(this.updateForm.controls);
    for (let i = 0; i < controlNames.length; i++) {
      const controlName = controlNames[i];
      const control = this.updateForm.get(controlName);
      if (control) {
        this.updateFormData.delete(controlName);
        if (controlName === "heure_debut" || controlName === "heure_fin") {
          this.updateFormData.append(controlName, this.createDateTimeStringFromHours(control.value))
        } else {
          this.updateFormData.append(controlName, control.value);
        }
      }
    }
    this.managerService.updateEmploye(this.employeToUpdate._id,this.updateFormData).subscribe({
      next: (data: any) => {
        let employe = this.employeToUpdate;
        this.listEmploye[employe.index] = data
        this.employeToUpdate = data;
        this.employeToUpdate.index = employe.index;
        this.updateRequestLoading.set(false);
      },
      error: (error) => {
        console.log(error);
        this.updateRequestLoading.set(false);
        this.updateError.set(true);
      }
    })
  }

}
