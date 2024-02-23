import { Component, Input, ViewContainerRef } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { FrontServiceComponent } from '../front-service/front-service.component';
import { FrontHeaderComponent } from '../front-header/front-header.component';
import { FrontEmployeComponent } from '../front-employe/front-employe.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from '../login/login.component';
import { FrontHistoriqueComponent } from '../front-historique/front-historique.component';
import { FrontOffreSpecialesComponent } from '../front-offre-speciales/front-offre-speciales.component';

@Component({
  selector: 'app-front',
  standalone: true,
  imports: [RouterOutlet,
    RouterLink,
    FrontServiceComponent,
    FrontHeaderComponent,
    FrontEmployeComponent,
    CommonModule,
    LoginComponent,
    FrontHistoriqueComponent,
    FrontOffreSpecialesComponent
  ],
  templateUrl: './front.component.html',
  styleUrl: './front.component.css'
})


export class FrontComponent {
}
