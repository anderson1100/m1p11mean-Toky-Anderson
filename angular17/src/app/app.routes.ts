import { Routes } from '@angular/router';
import { FrontComponent } from './front/front.component';
import { BackComponent } from './back/back.component';
import { CrudservicesComponent } from './crudservices/crudservices.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FrontServiceComponent } from './front-service/front-service.component';
import { FrontWrapper1Component } from './front-wrapper1/front-wrapper1.component';
import { FrontEmployeComponent } from './front-employe/front-employe.component';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { FrontFavorisComponent } from './front-favoris/front-favoris.component';
import { FrontHistoriqueComponent } from './front-historique/front-historique.component';
import { FrontWrapper2Component } from './front-wrapper2/front-wrapper2.component';

export const routes: Routes = [
   { 
        path:'',
        component: FrontComponent,
        children : [
            {
               path:'services', component: FrontWrapper1Component,
            },
            {
                path:'employes', component: FrontEmployeComponent,
            },
            {
                path:'favoris', component: FrontFavorisComponent
            },
            {
                path:'historique' , component: FrontHistoriqueComponent
            },
            {
                path:'offresSpeciales', component: FrontWrapper2Component
            }
           
        ]
    },


    { path: 'login', component: LoginComponent},
    { path:'back', component: BackComponent},
    { path: 'crudservice', component: CrudservicesComponent},
    { path:'dashboard', component: DashboardComponent},
];
