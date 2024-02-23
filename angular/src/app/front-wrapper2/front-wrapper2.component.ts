import { Component } from '@angular/core';
import { FrontHeaderComponent } from '../front-header/front-header.component';
import { FrontOffreSpecialesComponent } from '../front-offre-speciales/front-offre-speciales.component';

@Component({
  selector: 'app-front-wrapper2',
  standalone: true,
  imports: [
    FrontHeaderComponent,
    FrontOffreSpecialesComponent
  ],
  templateUrl: './front-wrapper2.component.html',
  styleUrl: './front-wrapper2.component.css'
})
export class FrontWrapper2Component {

}
