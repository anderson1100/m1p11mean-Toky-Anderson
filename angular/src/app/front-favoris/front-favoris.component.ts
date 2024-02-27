import { Component, OnInit, signal } from '@angular/core';
import { FrontHeaderComponent } from '../front-header/front-header.component';
import { FrontComponent } from '../front/front.component';
import { lastValueFrom } from 'rxjs';
import { EventService } from '../services/event.service';
import { ClientService } from '../services/client.service';

@Component({
  selector: 'app-front-favoris',
  standalone: true,
  imports: [
    FrontHeaderComponent,
    FrontComponent
  ],
  templateUrl: './front-favoris.component.html',
  styleUrl: './front-favoris.component.css'
})
export class FrontFavorisComponent implements OnInit {

  baseUrl: string = this.clientService.baseUrl

  loading = signal(true);

  listEmployeFav: any[] = [];

  listServiceFav: any[] = [];

  constructor(private clientService: ClientService, private events: EventService) { }

  ngOnInit(): void {
    this.clientService.getListEmployeFav().subscribe({
      next: async (data: any) => {
        this.listEmployeFav = data;
        this.clientService.getListServiceFav().subscribe({
          next: async (data: any) => {
            this.listServiceFav = data;
          },
          error: (error) => {
            console.log(error);
          },
          complete: () => {
            this.loading.set(false);
          }
        })
      },
      error: (error) => {
        console.log(error);
      }
    })

  }

  getService(idx : number) {
    const serviceFound = this.listServiceFav[idx];
    let service = serviceFound;
    this.events.emit('showServiceModal', service);
  }

  async removeEmployeFromFav(index: number) {
    let id = this.listEmployeFav[index]._id;
    this.listEmployeFav.splice(index,1);
    this.events.emit('activeToast', "L'employe a bien été supprimé de vos favoris");
    let data: any = await lastValueFrom(this.clientService.removeFromEmployesFav(id));
  }

  async removeServiceFromFav(index: number) {
    let id = this.listServiceFav[index]._id;
    this.listServiceFav.splice(index,1);
    this.events.emit('activeToast', "Le service a bien été supprimé de vos favoris");
    let data: any = await lastValueFrom(this.clientService.removeFromServicesFav(id));
  }

}
