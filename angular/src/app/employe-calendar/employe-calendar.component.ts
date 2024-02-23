import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-employe-calendar',
  standalone: true, 
  imports: [
    FullCalendarModule,
    CommonModule,
    FullCalendarModule,
    
  ],
  templateUrl: './employe-calendar.component.html',
  styleUrl: './employe-calendar.component.css'
})
export class EmployeCalendarComponent {
  currentMonth: number = new Date().getMonth();
  currentYear: number = new Date().getFullYear();
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  daysInMonth = new Date(this.currentYear, this.currentMonth +  1,  0).getDate();
}
