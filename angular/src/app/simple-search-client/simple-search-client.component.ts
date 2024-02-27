import { Component, OnInit, signal } from '@angular/core';
import { ClientService } from '../services/client.service';
import { EventService } from '../services/event.service';
import { lastValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { FrontHeaderComponent } from '../front-header/front-header.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-simple-search-client',
  standalone: true,
  imports: [CommonModule, FrontHeaderComponent],
  templateUrl: './simple-search-client.component.html',
  styleUrl: './simple-search-client.component.css'
})
export class SimpleSearchClientComponent implements OnInit {
  baseUrl: string = this.clientService.baseUrl;

  search = ""; //signal ?

  listService: any[] = [];

  countPage: any;

  page: number = 1;

  pagination: any[] = [];

  loading = signal(true);

  isReady = signal(false);

  constructor(private clientService: ClientService, private events: EventService, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.queryParamMap.subscribe(async (params) => {
      const search = params.get('search');
      console.log(search);
      if (search === null) {
        this.isReady.set(false);
      } else {
        await this.simpleSearch(search);
      }
    });
  }

  async simpleSearch(text: string) {
    this.search = text;
    this.loading.set(true);
    console.log("it works")
    this.isReady.set(true);
    const data: any = await lastValueFrom(this.clientService.simpleSearch(this.search, this.page.toString()));
    this.listService = data;
    this.page = 1;
    this.countPage = await lastValueFrom(this.clientService.countPagesSimpleSearch(text));
    console.log("count", this.countPage)
    this.pagination = this.clientService.pageToShow(this.page, this.countPage);
    this.loading.set(false);
  }

  changePage = async (page: number) => {
    this.page = page;
    const data: any = await lastValueFrom(this.clientService.simpleSearch(this.search, page.toString()));
    this.pagination = this.clientService.pageToShow(page, this.countPage);
    //console.log(this.pagination[i]);
    this.listService = data;
  }

  getService(index: number) {
    const serviceFound = this.listService[index]
    let service = serviceFound;
    this.events.emit('showServiceModal', service);
  }

  async addServiceToFav(idx: number) {
    this.listService[idx].isFav = true;
    this.events.emit('activeToast', "Le service a bien été ajouté parmis vos favoris");
    let data: any = await lastValueFrom(this.clientService.addToServicesFav(this.listService[idx]._id));
  }

  async removeServiceFromFav(idx: number) {
    this.listService[idx].isFav = false;
    this.events.emit('activeToast', "Le service a bien été supprimé de vos favoris");
    let data: any = await lastValueFrom(this.clientService.removeFromServicesFav(this.listService[idx]._id));
  }
}
