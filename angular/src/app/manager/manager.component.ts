import { Component } from '@angular/core';
import { ManagerPersonnelComponent } from '../manager-personnel/manager-personnel.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { ManagerServiceComponent } from '../manager-service/manager-service.component';
import { ManagerDashboardComponent } from '../manager-dashboard/manager-dashboard.component';
import { ManagerService } from '../services/manager.service';

@Component({
  selector: 'app-manager',
  standalone: true,
  imports: [
    ManagerPersonnelComponent,
    RouterOutlet,
    RouterLink,
    ManagerServiceComponent,
    ManagerDashboardComponent
  ],
  templateUrl: './manager.component.html',
  styleUrl: './manager.component.css'
})
export class ManagerComponent {

  constructor(private router : Router, private managerService : ManagerService){

  }

  logout() {
    this.router.navigate(['/manager/login'])
    this.managerService.logout().subscribe({
      next: (data: any) => {
        console.log("logout");
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

}
