import { Component, OnInit, signal } from '@angular/core';
import { TableModule } from 'primeng/table';
import { ClientService } from '../services/client.service';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-front-historique',
  standalone: true,
  imports: [],
  templateUrl: './front-historique.component.html',
  styleUrl: './front-historique.component.css'
})
export class FrontHistoriqueComponent implements OnInit {
  loading = signal(true);

  listRdv: any[] = [];

  constructor(private clientService: ClientService, private events: EventService) {
    events.listen('donePay', async (message) => {
      this.clientService.getListRdv().subscribe({
        next: async (data: any) => {
          this.listRdv = data;
          //console.log("next")
          //this.loading.set(false);
        }
      })
    })
  }

  ngOnInit(): void {
    this.clientService.getListRdv().subscribe({
      next: async (data: any) => {
        this.listRdv = data;
        //console.log("next")
        //this.loading.set(false);
      },
      error: (error) => {
        console.log(error);
        //this.loading.set(false);
      },
      complete: () => {
        //console.log("complete")
        this.loading.set(false);
      }
    })

  }

  pay(rdv: object) {
    this.events.emit('payRdv', rdv);
  }

}