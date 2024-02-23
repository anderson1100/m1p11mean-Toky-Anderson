import { AfterViewChecked, Component, Injectable, OnInit, signal } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClientService } from '../services/client.service';
import { lastValueFrom } from 'rxjs';



@Component({
  selector: 'app-front-service',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './front-service.component.html',
  styleUrl: './front-service.component.css'
})
export class FrontServiceComponent implements OnInit, AfterViewChecked {

  baseUrl: string = this.clientService.baseUrl
  
  listCategorie: any[] = [];

  listService: any[][] = [];

  listPage: number[] = [];

  service: any;

  loading = signal(true);

  modalLoading = signal(true);

  constructor(private clientService: ClientService) { }

  ngAfterViewChecked(): void {
    
  }

  ngOnInit(): void {
    this.clientService.getListCategorie().subscribe({
      next: async (data: any) => {
        this.listCategorie = data;
        this.listPage = Array(this.listCategorie.length).fill(1);
        for (let categorie of this.listCategorie) {
          const data : any = await lastValueFrom(this.clientService.getListServiceByCategorie(categorie._id));
          this.listService.push(data);
        }
        this.loading.set(false);
        //console.log("loading false");
        //console.log("services",this.listService);
      },
      error: (error) => {
        this.loading.set(false);
        console.log(error);
      }
    })
  }

  getService(service_id : string){
    this.clientService.getService(service_id).subscribe({
      next : (data : any) =>{
        this.service = data;
        this.modalLoading.set(false);
      }
    })
  }


}
