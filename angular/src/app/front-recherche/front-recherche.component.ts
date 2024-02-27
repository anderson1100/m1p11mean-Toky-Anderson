import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { AfterViewChecked, ChangeDetectorRef, Component, OnInit, signal } from '@angular/core';
import { ClientService } from '../services/client.service';
import { EventService } from '../services/event.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-front-recherche',
  standalone: true,
  imports: [
    HttpClientModule,
    CommonModule
  ],
  templateUrl: './front-recherche.component.html',
  styleUrl: './front-recherche.component.css'
})
export class FrontRechercheComponent implements OnInit, AfterViewChecked {

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
    
  }

  getService(service_id: string) {
    this.addedBasket.set(false);
    this.modalLoading.set(true);
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
  }

  async removeServiceFromFav(service_id : string){
    let data : any = await lastValueFrom(this.clientService.removeFromServicesFav(service_id));
    this.events.emit('activeToast', "Le service a bien été supprimé de vos favoris");
  }

  getFavIcon(isFav : boolean){
    return isFav ? "fa fa-heart" : "fa fa-heart-o";
  }


}
