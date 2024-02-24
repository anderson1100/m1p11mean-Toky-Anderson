import { Component, Input, OnInit, ViewContainerRef, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FrontServiceComponent } from '../front-service/front-service.component';
import { FrontHeaderComponent } from '../front-header/front-header.component';
import { FrontEmployeComponent } from '../front-employe/front-employe.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { FrontHistoriqueComponent } from '../front-historique/front-historique.component';
import { FrontOffreSpecialesComponent } from '../front-offre-speciales/front-offre-speciales.component';
import { ClientService } from '../services/client.service';
import { lastValueFrom } from 'rxjs';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-front',
  standalone: true,
  imports: [RouterOutlet,
    RouterLink,
    FrontServiceComponent,
    FrontHeaderComponent,
    FrontEmployeComponent,
    CommonModule,
    LoginComponent,
    FrontHistoriqueComponent,
    FrontOffreSpecialesComponent
  ],
  templateUrl: './front.component.html',
  styleUrl: './front.component.css'
})


export class FrontComponent implements OnInit {

  toastMessage: string = "";

  isVisible: boolean = false;

  hide() {
    this.isVisible = false;
  }

  ////

  baseUrl: string = this.clientService.baseUrl

  basket: any;

  dureeTotal: any = 0;

  priceTotal: any = 0;

  loading = signal(true);

  constructor(private clientService: ClientService, private events: EventService) {
    events.listen('addingToBasket', async (service_id) => {
      await this.getBasket();
    })

    events.listen('activeToast', async (message) => {
      this.toastMessage = message;
      this.isVisible = true;
      setTimeout(() => {
        this.hide();
      }, 5000); // Hide after 5 seconds
    })
  }

  ngOnInit(): void {
    this.getBasket();
    //this.show();
  }

  async getBasket() {
    let basketData = await lastValueFrom(this.clientService.getBasket());
    this.basket = basketData;
    let dureeTotalData = await lastValueFrom(this.clientService.getTotalDureeBasket());
    this.dureeTotal = dureeTotalData
    let priceTotalData = await lastValueFrom(this.clientService.getTotalPriceBasket());
    this.priceTotal = priceTotalData;
    this.loading.set(false);
  }

  async removeFromBasket(id: string) {
    this.loading.set(true);
    await lastValueFrom(this.clientService.removeFromBasket(id));
    await this.getBasket();
    this.loading.set(false);
  }

}
