import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-employe-calendar',
  standalone: true, 
  imports: [
    CommonModule,
    
  ],
  templateUrl: './employe-calendar.component.html',
  styleUrl: './employe-calendar.component.css'
})
export class EmployeCalendarComponent {
}
