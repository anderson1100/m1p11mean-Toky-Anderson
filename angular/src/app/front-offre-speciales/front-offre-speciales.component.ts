import { CommonModule } from '@angular/common';
import { Component, OnInit, signal } from '@angular/core';
import { EventService } from '../services/event.service';
import { ClientService } from '../services/client.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-front-offre-speciales',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './front-offre-speciales.component.html',
  styleUrl: './front-offre-speciales.component.css'
})
export class FrontOffreSpecialesComponent implements OnInit{

  baseUrl: string = this.clientService.baseUrl

  loading = signal(true);

  listOffre: any[] = [];

  isConnected : boolean = true;

  constructor(private clientService: ClientService, private events: EventService) { }

  ngOnInit(): void {
    this.clientService.getListOffreSpeciale().subscribe({
        next: async (data: any) => {
          this.listOffre = data;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.loading.set(false);
        }
      })

  }

  getService(service_id: string, idx : number) {
    const serviceFound = this.listOffre[idx].liste_service.find((service: any) => service._id === service_id)
    let service = serviceFound;
    this.events.emit('showServiceModal', service);
  }

  async addServiceToFav(service_id: string, idx: number) {
    let index = this.listOffre[idx].liste_service.findIndex((service : any) => service._id === service_id);
    this.listOffre[idx].liste_service[index].isFav = true;
    this.events.emit('activeToast', "Le service a bien été ajouté parmis vos favoris");
    let data: any = await lastValueFrom(this.clientService.addToServicesFav(service_id));
    //this.cdr.detectChanges();
  }

  async removeServiceFromFav(service_id: string, idx: number) {
    let index = this.listOffre[idx].liste_service.findIndex((service : any) => service._id === service_id);
    this.listOffre[idx].liste_service[index].isFav = false;
    this.events.emit('activeToast', "Le service a bien été supprimé de vos favoris");
    let data: any = await lastValueFrom(this.clientService.removeFromServicesFav(service_id));
    //this.cdr.detectChanges();
  }

}
