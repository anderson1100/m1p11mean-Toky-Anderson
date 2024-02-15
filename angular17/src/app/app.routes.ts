import { Routes } from '@angular/router';
import { FrontComponent } from './front/front.component';
import { BackComponent } from './back/back.component';
import { CrudservicesComponent } from './crudservices/crudservices.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path:'front', component: FrontComponent},
    { path:'', component: BackComponent},
    { path: 'crudservice', component: CrudservicesComponent},
    { path:'dashboard', component: DashboardComponent}
];
