import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { EmployeCalendarComponent } from '../employe-calendar/employe-calendar.component';
import { EmployeProfilComponent } from '../employe-profil/employe-profil.component';

@Component({
  selector: 'app-employe',
  standalone: true,
  imports: [
    RouterLink,
    RouterOutlet,
    EmployeCalendarComponent,
    EmployeProfilComponent

  ],
  templateUrl: './employe.component.html',
  styleUrl: './employe.component.css'
})
export class EmployeComponent {

}
