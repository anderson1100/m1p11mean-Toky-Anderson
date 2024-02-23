import { Component } from '@angular/core';
import { ManagerPersonnelComponent } from '../manager-personnel/manager-personnel.component';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ManagerServiceComponent } from '../manager-service/manager-service.component';
import { ManagerDashboardComponent } from '../manager-dashboard/manager-dashboard.component';

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

}
