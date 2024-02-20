import { Component } from '@angular/core';
import { FrontHeaderComponent } from '../front-header/front-header.component';
import { FrontComponent } from '../front/front.component';

@Component({
  selector: 'app-front-favoris',
  standalone: true,
  imports: [
    FrontHeaderComponent,
    FrontComponent
  ],
  templateUrl: './front-favoris.component.html',
  styleUrl: './front-favoris.component.css'
})
export class FrontFavorisComponent {

}
