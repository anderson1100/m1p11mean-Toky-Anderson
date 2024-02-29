import { Component, OnInit, ViewChild, signal } from '@angular/core';
import { DropzoneComponent } from 'ngx-dropzone-wrapper';
import { DropzoneModule } from 'ngx-dropzone-wrapper';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { ManagerService } from '../services/manager.service';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-manager-service',
  standalone: true,
  imports: [
    DropzoneModule, FormsModule, ReactiveFormsModule, NgxDropzoneModule
  ],
  templateUrl: './manager-service.component.html',
  styleUrl: './manager-service.component.css'
})
export class ManagerServiceComponent implements OnInit {

  constructor(private managerService: ManagerService, private formBuilder : FormBuilder) {

  }

  ngOnInit(): void {
    this.getListService();
    this.getListCategorie();
    this.getListOffre();
  }

  baseUrl: string = this.managerService.baseUrl

  listService: any[] = [];

  addFormData = new FormData();

  updateFormData = new FormData();

  listCategorie: any[] = [];

  listOffre: any[] = [];

  addOffreError = signal(false);

  addOffreLoading = signal(false);

  updateOffreError = signal(false);

  updateOffreLoading = signal(true);

  updateOffreRequestLoading = signal(false);

  offreToDelete: any = null;

  deleteOffreLoading = signal(false);

  offreToUpdate: any = null;

  addForm: FormGroup = new FormGroup({
    nom: new FormControl("service test"),
    description: new FormControl("service test description"),
    prix: new FormControl(10000),
    commission: new FormControl(10),
    duree_minute: new FormControl(20),
    id_categorie: new FormControl("65ce14be434eeee43c1b33ba")
  })

  updateForm: FormGroup = new FormGroup({
    nom: new FormControl(""),
    description: new FormControl(""),
    prix: new FormControl(0),
    commission: new FormControl(0),
    duree_minute: new FormControl(0),
    id_categorie: new FormControl("")
  })

  addOffreForm: FormGroup =  new FormGroup({
    nom: new FormControl("offre test"),
    description: new FormControl('offre test description'),
    reduction: new FormControl(10),
    id_services: new FormControl([]),
    date_debut:new FormControl((new Date()).toISOString().slice(0, 16)),
    date_fin: new FormControl((new Date()).toISOString().slice(0, 16))
  });

  updateOffreForm: FormGroup = new FormGroup({
    nom: new FormControl("... loading"),
    description: new FormControl('offre test description'),
    reduction: new FormControl(10),
    id_services: new FormControl([]),
    date_debut:new FormControl((new Date()).toISOString().slice(0, 16)),
    date_fin: new FormControl((new Date()).toISOString().slice(0, 16))
  });

  addError = signal(false);

  addLoading = signal(false);

  updateError = signal(false);

  updateLoading = signal(true);

  updateRequestLoading = signal(false);

  serviceToDelete: any = null;

  deleteLoading = signal(false);

  serviceToUpdate: any = null;

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

  getListCategorie() {
    this.managerService.getCategories().subscribe({
      next: (data: any) => {
        this.listCategorie = data;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  getListService() {
    this.managerService.getServices().subscribe({
      next: (data: any) => {
        this.listService = data;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  deleteService() {
    //this.addLoading.set(true);
    console.log("delete function")
    if (this.serviceToDelete) {
      console.log("serviceToDelete exists")
      this.listService.splice(this.serviceToDelete.index, 1);
      this.managerService.deleteService(this.serviceToDelete._id).subscribe({
        next: (data: any) => {
          console.log("deleted");
          this.serviceToDelete = null;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  openDeleteModal(index: any) {
    this.serviceToDelete = this.listService[index];
    this.serviceToDelete.index = index;
  }

  openUpdateModal(index: any) {
    console.log("open modal update");
    this.updateFiles = [];
    this.updateLoading.set(true);
    this.serviceToUpdate = this.listService[index];
    this.serviceToUpdate.index = index;
    console.log(this.serviceToUpdate);
    this.updateForm = new FormGroup({
      nom: new FormControl(this.serviceToUpdate.nom),
      description: new FormControl(this.serviceToUpdate.description),
      prix: new FormControl(this.serviceToUpdate.prix),
      commission: new FormControl(this.serviceToUpdate.commission),
      duree_minute: new FormControl(this.serviceToUpdate.duree_minute),
      id_categorie: new FormControl(this.serviceToUpdate.categorie._id)
    });
    this.updateLoading.set(false);
    console.log(this.serviceToUpdate);
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
    this.addFormData.append("image", this.files[0]);
  }

  onRemove(event: any) {
    //console.log(event);
    this.files.splice(this.files.indexOf(event), 1);
    this.addFormData.delete("image");
  }

  addService() {
    //console.log("add employe")
    this.addError.set(false);
    this.addLoading.set(true);
    const controlNames = Object.keys(this.addForm.controls);
    for (let i = 0; i < controlNames.length; i++) {
      const controlName = controlNames[i];
      const control = this.addForm.get(controlName);
      if (control) {
        this.addFormData.delete(controlName);
        this.addFormData.append(controlName, control.value);
      }
    }

    this.managerService.addService(this.addFormData).subscribe({
      next: (data: any) => {
        this.getListService();
      },
      error: (error) => {
        console.log(error);
        this.addLoading.set(false);
        this.addError.set(true);

      },
      complete: () => {
        this.getListService();
        this.addLoading.set(false);
      }
    })
  }

  updateFiles: File[] = [];

  onSelectUpdateImage(event: any) {
    this.updateFiles = [];
    //console.log(event);
    this.updateFiles.push(...event.addedFiles);
    this.updateFormData.append("image", this.updateFiles[0]);
  }

  onRemoveUpdateImage(event: any) {
    //console.log(event);
    this.updateFiles.splice(this.updateFiles.indexOf(event), 1);
    this.updateFormData.delete("image");
  }


  updateService() {
    //console.log("add employe")
    //unexpected field after two successive update
    this.updateError.set(false);
    this.updateRequestLoading.set(true);
    const controlNames = Object.keys(this.updateForm.controls);
    for (let i = 0; i < controlNames.length; i++) {
      const controlName = controlNames[i];
      const control = this.updateForm.get(controlName);
      if (control) {
        this.updateFormData.delete(controlName);
        this.updateFormData.append(controlName, control.value);
      }
    }
    this.managerService.updateService(this.serviceToUpdate._id, this.updateFormData).subscribe({
      next: (data: any) => {
        let service = this.serviceToUpdate;
        this.listService[service.index] = data
        this.serviceToUpdate = data;
        this.serviceToUpdate.index = service.index;
        this.updateRequestLoading.set(false);
      },
      error: (error) => {
        console.log(error);
        this.updateRequestLoading.set(false);
        this.updateError.set(true);
      }
    })
  }


  // offres speciales

  // get items(): FormArray {
  //   return this.addOffreForm.get('items') as FormArray;
  // }

  // addItem(): void {
  //   if(this.listService.length>0)
  //     this.items.push(this.formBuilder.control(this.listService[0]._id));
  // }

  // removeItem(index: number): void {
  //   this.items.removeAt(index);
  // }

  getListOffre() {
    this.managerService.getOffres().subscribe({
      next: (data: any) => {
        this.listOffre = data;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  deleteOffre() {
    //this.addLoading.set(true);
    console.log("delete function")
    if (this.offreToDelete) {
      //console.log("serviceToDelete exists")
      this.listOffre.splice(this.offreToDelete.index, 1);
      this.managerService.deleteOffre(this.offreToDelete._id).subscribe({
        next: (data: any) => {
          console.log("deleted");
          this.offreToDelete = null;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  openDeleteOffreModal(index: any) {
    this.offreToDelete = this.listOffre[index];
    this.offreToDelete.index = index;
  }

  getListNameFromListService(list: any[]) {
    let text = "";
    for (let service of list) {
      if (this.listService.length > 0) {
        text += service.nom + ",";
      }
    }
    if (text.length > 0) {
      text = text.slice(0, -1);
    }
    return text;
  }

  openUpdateOffreModal(index: any) {
    console.log("open modal update");
    this.updateOffreLoading.set(true);
    this.offreToUpdate = this.listOffre[index];
    this.offreToUpdate.index = index;
    //console.log(this.offreToUpdate);
    this.updateForm = new FormGroup({
      nom: new FormControl(this.offreToUpdate.nom),
      description: new FormControl(this.offreToUpdate.description),
      reduction: new FormControl(this.offreToUpdate.reduction[0]),
      liste_service: new FormControl(this.offreToUpdate.liste_service),
      date_debut: new FormControl(this.offreToUpdate.date_debut.toISOString().slice(0, 16)),
      date_fin: new FormControl(this.offreToUpdate.date_fin.toISOString().slice(0, 16)),
    });
    this.updateLoading.set(false);
    console.log(this.serviceToUpdate);
  }

  addOffre() {
    this.addOffreError.set(false);
    this.addOffreLoading.set(true);
    this.managerService.addOffre(this.addOffreForm.value).subscribe({
      next: (data: any) => {
        this.getListOffre();
      },
      error: (error) => {
        console.log(error);
        this.addOffreLoading.set(false);
        this.addOffreError.set(true);

      },
      complete: () => {
        this.getListOffre();
        this.addOffreLoading.set(false);
      }
    })
  }

  updateOffre() {
    //console.log("add employe")
    //unexpected field after two successive update
    this.updateOffreError.set(false);
    this.updateOffreRequestLoading.set(true);
    let updateOffreFormData = new FormData();
    this.managerService.updateOffre(this.offreToUpdate._id, this.updateOffreForm).subscribe({
      next: (data: any) => {
        let offre = this.offreToUpdate;
        this.listOffre[offre.index] = data
        this.offreToUpdate = data;
        this.offreToUpdate.index = offre.index;
        this.updateOffreRequestLoading.set(false);
      },
      error: (error) => {
        console.log(error);
        this.updateOffreRequestLoading.set(false);
        this.updateOffreError.set(true);
      }
    })
  }

}