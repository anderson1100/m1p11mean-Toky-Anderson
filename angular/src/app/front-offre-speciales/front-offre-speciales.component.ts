import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-front-offre-speciales',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './front-offre-speciales.component.html',
  styleUrl: './front-offre-speciales.component.css'
})
export class FrontOffreSpecialesComponent {
  isConnected : boolean = false;

}
