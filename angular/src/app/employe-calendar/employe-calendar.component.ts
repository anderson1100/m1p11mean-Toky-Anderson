import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, signal } from '@angular/core';
import { EmployeService } from '../services/employe.service';
import { lastValueFrom } from 'rxjs';
import { EventService } from '../services/event.service';

@Component({
  selector: 'app-employe-calendar',
  standalone: true, 
  imports: [
    CommonModule,
    
  ],
  templateUrl: './employe-calendar.component.html',
  styleUrl: './employe-calendar.component.css'
})
export class EmployeCalendarComponent implements OnInit{

  listRdv: any[] = [];

  dateAjd: any;

  commission: any;

  listRdvAjd: any[] = [];

  complete = signal(false);

  loading = signal(true);

  modalLoafing = signal(false);

  rendezvous : any;

  constructor(private employeService : EmployeService, private events : EventService, private cdr : ChangeDetectorRef){
    events.listen('Service complété', async(message) =>{
      this.employeService.getHistoryRdv().subscribe({
        next: async (data : any) =>{
          this.listRdv = data;
        }
      });
    })

    events.listen('Service complété', async(message) =>{
      this.employeService.getListRdv().subscribe({
        next: async(data : any) =>{
          this.listRdvAjd = data;
        }
      });
    })
    
  }



  ngOnInit(): void {
    this.employeService.getHistoryRdv().subscribe({
      next: async (data : any) =>{
        this.listRdv = data;
      },
    })

    this.employeService.getListRdv().subscribe({
      next: async(data : any) =>{
        this.listRdvAjd = data;
      }
    })

    const date = new Date;
    this.dateAjd = date;

    this.getCommission();
    this.loading.set(false);
  }


  async completeRdv(id_rdv: string){
    let data : any = await lastValueFrom(this.employeService.completeRdv(id_rdv));
    this.events.emit('Service complété', id_rdv);

  }

  getRdvById(id_rdv : string){

    const rendezvous = this.listRdvAjd.flat().find(rendezvous => id_rdv === rendezvous._id);
    this.rendezvous = rendezvous;
    console.log(this.rendezvous._id)
    
  }

  async getHistoriqueRdv(){
    
    this.employeService.getHistoryRdv().subscribe((listRdv: any[]) =>{
      this.listRdv = listRdv;
      this.dateAjd = new Date();

    });
  }

  getListRdv(){
    this.employeService.getListRdv().subscribe((listRdvAjd: any[]) =>{
      this.listRdvAjd = listRdvAjd; 
    })
  }

  getCommission(){
    this.employeService.getCommission().subscribe(commission =>{
      this.commission = commission;
    })
  }
  
}
 