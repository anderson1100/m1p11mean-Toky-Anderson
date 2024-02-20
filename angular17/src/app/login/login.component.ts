import { Component } from '@angular/core';
import { FrontComponent } from '../front/front.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FrontComponent,
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})



export class LoginComponent {
  
  ngOnInit(){

  }
}
