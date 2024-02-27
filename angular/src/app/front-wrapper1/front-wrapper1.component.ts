import { Component } from '@angular/core';
import { FrontServiceComponent } from '../front-service/front-service.component';
import { FrontHeaderComponent } from '../front-header/front-header.component';

@Component({
  selector: 'app-front-wrapper1',
  standalone: true,
  imports: [
    FrontServiceComponent,
    FrontHeaderComponent
  ],
  templateUrl: './front-wrapper1.component.html',
  styleUrl: './front-wrapper1.component.css'
})
export class FrontWrapper1Component {

}
