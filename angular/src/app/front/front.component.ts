import { AfterViewChecked, AfterViewInit, ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild, ViewContainerRef, signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
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
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
    FrontOffreSpecialesComponent,
    FormsModule,
    ReactiveFormsModule
  ],
  templateUrl: './front.component.html',
  styleUrl: './front.component.css'
})


export class FrontComponent implements OnInit, AfterViewInit {

  @ViewChild('modalRDV') rdvModal: ElementRef = {} as ElementRef;

  searchControl = new FormControl('');

  toastMessage: string = "";

  isVisible: boolean = false;

  rdvTakenSuccess = signal(false);

  rdvTakenError = signal(false);

  rdvLoading = signal(false);

  payTotalPrice: number = 0;

  payTotalDuree: number = 0;

  payRdv: any = null;

  paySuccess = signal(false);

  payError = signal(false);

  payLoading = signal(false);

  payModalLoading = signal(true);

  rdvErrorMessage = "Une erreur s'est produite! Veuillez réessayer";

  rdvForm = new FormGroup({
    employeId: new FormControl(null),
    dateHeureString: new FormControl(this.clientService.formatDate(new Date()))
  });

  payForm = new FormGroup({
    cvv: new FormControl(null),
    expiration: new FormControl(""),
    nom: new FormControl(""),
    carte: new FormControl("")
  });


  listEmploye: any[] = [];

  baseUrl: string = this.clientService.baseUrl

  basket: any;

  dureeTotal: any = 0;

  priceTotal: any = 0;

  loading = signal(true);

  service: any;

  modalLoading = signal(true);

  basketLoading = signal(false);

  addedBasket = signal(false);

  constructor(private clientService: ClientService, private events: EventService, private cdr: ChangeDetectorRef, private router: Router) {

    events.listen('activeToast', async (message) => {
      this.toastMessage = message;
      this.isVisible = true;
      setTimeout(() => {
        this.hide();
      }, 5000); // Hide after 5 seconds
    })

    events.listen('payRdv', async (data) => {
      this.payModalLoading.set(true);
      this.payError.set(false);
    this.paySuccess.set(false);
    this.payLoading.set(false);
    this.payRdv = data;
          this.payTotalDuree = data.totalDuree;
          this.payTotalPrice = data.totalPrice;
          this.payModalLoading.set(false);
    })

    events.listen('showServiceModal', (serviceFound) => {
      this.addedBasket.set(false);
      this.modalLoading.set(true);
      // this.clientService.getService(service_id).subscribe({
      //   next: (data: any) => {
      //     this.service = data;
      //     this.modalLoading.set(false);
      //   }
      // })
      this.service = serviceFound;
      this.modalLoading.set(false);

    })

  }

  ngOnInit(): void {

    //not awaiting causing problem???

    this.rdvTakenError.set(false);
    this.rdvTakenSuccess.set(false);
    this.rdvLoading.set(false);

    this.payError.set(false);
    this.paySuccess.set(false);
    this.payLoading.set(false);

    //this.show();

    //async await verify
    this.getBasket();
    this.clientService.getListEmploye().subscribe({
      next: (data: any) => {
        this.listEmploye = data;
        this.rdvForm.controls['employeId'].setValue(this.listEmploye[0]._id);
      },
      error: (error) => {
        console.log(error)
      }
    })

  }

  ngAfterViewInit() {
    const myModalElement = this.rdvModal.nativeElement;
    myModalElement.addEventListener('hidden.bs.modal', async () => {
      console.log('rdvmodal was closed');
      await this.getBasket();
    });
  }

  search(){
    console.log("form control",this.searchControl.value);
    this.router.navigate(['/simple_search'], { queryParams: { search: this.searchControl.value } });
  }

  logout() {
    this.router.navigate(['/login'])
    this.clientService.logout().subscribe({
      next: (data: any) => {
        console.log("logout");
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  takeRdv() {
    this.rdvTakenError.set(false);
    this.rdvTakenSuccess.set(false);
    this.rdvLoading.set(true);
    this.rdvForm.controls['dateHeureString'].setValue(`${this.rdvForm.value.dateHeureString}:00`);
    //console.log(this.rdvForm.value);
    this.clientService.takeRdv(this.rdvForm.value).subscribe({
      next: async (data: any) => {
        if (data.state === -1) {
          this.rdvErrorMessage = "Désolé, l'employé sélectionné est déjà occupé dans cette période de temps.";
          this.rdvTakenError.set(true);
        } else if (data.state === 0) {
          this.rdvErrorMessage = "Désolé! L'employé choisi ne travaille pas à cette heure là!";
          this.rdvTakenError.set(true);
        } else if (data.state === 1) {
          this.rdvTakenSuccess.set(true);
          this.payRdv = data.rdv;
          this.payTotalDuree = this.dureeTotal;
          this.payTotalPrice = this.priceTotal;
          this.payModalLoading.set(false);
        } else {
          this.rdvErrorMessage = "Une erreur s'est produite! Veuillez réessayer";
          this.rdvTakenError.set(true);
        }
      },
      error: (error) => {
        this.rdvErrorMessage = "Une erreur s'est produite! Veuillez réessayer";
        this.rdvTakenError.set(true);
      },
      complete: () => {
        this.rdvLoading.set(false);
      }
    })
  }

  pay() {
    this.payError.set(false);
    this.paySuccess.set(false);
    this.payLoading.set(true);
    let payObject = { id: this.payRdv._id.toString(), carte: this.payForm.get('carte')?.value, nom: this.payForm.get('nom')?.value, montant: this.payTotalPrice };
    this.clientService.payment(payObject).subscribe({
      next: async (data: any) => {
        this.paySuccess.set(true);
        this.payLoading.set(false);
        this.events.emit('donePay',"");
        // this.toastMessage = "Merci de votre confiance!!";
        // this.isVisible = true;
      },
      error: (error) => {
        this.payLoading.set(false);
        this.payError.set(true);
      }
    })
  }


  hide() {
    this.isVisible = false;
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

  async addToBasket(service_id: string) {
    //console.log("addToBasket")
    this.basketLoading.set(true);
    let data: any = await lastValueFrom(this.clientService.addToBasket(service_id));
    await this.getBasket();
    this.basketLoading.set(false);
    this.addedBasket.set(true);
    //console.log("addToBasket finished")
  }

}
