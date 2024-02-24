import { AfterViewChecked, ChangeDetectorRef, Component, Injectable, OnInit, signal } from '@angular/core';
import { ServiceService } from '../services/service.service';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ClientService } from '../services/client.service';
import { lastValueFrom } from 'rxjs';
import { EventService } from '../services/event.service';



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

  pagination: any[] = [];

  service: any;

  loading = signal(true);

  modalLoading = signal(true);

  basketLoading = signal(false);
  
  addedBasket = signal(false);

  constructor(private clientService: ClientService, private events : EventService, private cdr : ChangeDetectorRef) { }

  ngAfterViewChecked(): void {

  }

  ngOnInit(): void {
    this.clientService.getListCategorie().subscribe({
      next: async (data: any) => {
        this.listCategorie = data;
        this.listPage = Array(this.listCategorie.length).fill(1);
        this.pagination = Array(this.listCategorie.length);
        let i = 0;
        for (let categorie of this.listCategorie) {
          const data: any = await lastValueFrom(this.clientService.getListServiceByCategorie(categorie._id, this.listPage[i].toString()));
          let countPages: any = await lastValueFrom(this.clientService.countPagesByCategorie(categorie._id))
          this.pagination[i] = this.clientService.pageToShow(this.listPage[i], countPages);
          console.log(this.pagination[i]);
          this.listService.push(data);
          i++;
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

  getService(service_id: string) {
    this.addedBasket.set(false);
    this.modalLoading.set(true);
    // this.clientService.getService(service_id).subscribe({
    //   next: (data: any) => {
    //     this.service = data;
    //     this.modalLoading.set(false);
    //   }
    // })
    const serviceFound = this.listService.flat().find(service => service._id === service_id);
    this.service = serviceFound;
    this.modalLoading.set(false);

  }

  changePage = async (indexCategorie: number, page: number) => {
    this.listPage[indexCategorie] = page;
    let categorie_id = this.listCategorie[indexCategorie]._id;
    const data: any = await lastValueFrom(this.clientService.getListServiceByCategorie(categorie_id, this.listPage[indexCategorie].toString()));
    let countPages: any = await lastValueFrom(this.clientService.countPagesByCategorie(categorie_id))
    this.pagination[indexCategorie] = this.clientService.pageToShow(this.listPage[indexCategorie], countPages);
    //console.log(this.pagination[i]);
    this.listService[indexCategorie] = data;
  }

  async addToBasket(service_id : string){
    this.basketLoading.set(true);
    let data : any = await lastValueFrom(this.clientService.addToBasket(service_id));
    this.events.emit('addingToBasket', service_id);
    this.basketLoading.set(false);
    this.addedBasket.set(true);
  }

  async addServiceToFav(service_id : string){
    let data : any = await lastValueFrom(this.clientService.addToServicesFav(service_id));
    this.events.emit('activeToast', "Le service a bien été ajouté parmis vos favoris");
    //this.cdr.detectChanges();
  }

  async removeServiceFromFav(service_id : string){
    let data : any = await lastValueFrom(this.clientService.removeFromServicesFav(service_id));
    this.events.emit('activeToast', "Le service a bien été supprimé de vos favoris");
    //this.cdr.detectChanges();
  }

  getFavIcon(isFav : boolean){
    return isFav ? "fa fa-heart" : "fa fa-heart-o";
  }


}
