import { Component, OnInit, signal } from '@angular/core';
import { ClientService } from '../services/client.service';
import { EventService } from '../services/event.service';
import { lastValueFrom } from 'rxjs';

@Component({
  selector: 'app-front-employe',
  standalone: true,
  imports: [],
  templateUrl: './front-employe.component.html',
  styleUrl: './front-employe.component.css'
})
export class FrontEmployeComponent implements OnInit{

  baseUrl: string = this.clientService.baseUrl

  loading = signal(true);

  listEmploye: any[] = [];

  isConnected : boolean = true;

  constructor(private clientService: ClientService, private events: EventService) { }

  ngOnInit(): void {
    this.clientService.getListEmploye().subscribe({
        next: async (data: any) => {
          this.listEmploye = data;
        },
        error: (error) => {
          console.log(error);
        },
        complete: () => {
          this.loading.set(false);
        }
      })

  }

  async addEmployeToFav(index: number) {
    this.listEmploye[index].isFav = true;
    this.events.emit('activeToast', "L'employé a bien été ajouté parmis vos favoris");
    let data: any = await lastValueFrom(this.clientService.addToEmployesFav(this.listEmploye[index]._id));
  }

  async removeEmployeFromFav(index : number) {
    this.listEmploye[index].isFav = false;
    this.events.emit('activeToast', "L'employe a bien été supprimé de vos favoris");
    let data: any = await lastValueFrom(this.clientService.removeFromEmployesFav(this.listEmploye[index]._id));
  }

}
