import { Routes } from '@angular/router';
import { FrontComponent } from './front/front.component';
import { FrontWrapper1Component } from './front-wrapper1/front-wrapper1.component';
import { FrontEmployeComponent } from './front-employe/front-employe.component';
import { LoginComponent } from './login/login.component';
import { FrontFavorisComponent } from './front-favoris/front-favoris.component';
import { FrontHistoriqueComponent } from './front-historique/front-historique.component';
import { FrontWrapper2Component } from './front-wrapper2/front-wrapper2.component';
import { EmployeComponent } from './employe/employe.component';
import { EmployeCalendarComponent } from './employe-calendar/employe-calendar.component';
import { EmployeProfilComponent } from './employe-profil/employe-profil.component';
import { ManagerComponent } from './manager/manager.component';
import { ManagerPersonnelComponent } from './manager-personnel/manager-personnel.component';
import { ManagerServiceComponent } from './manager-service/manager-service.component';
import { ManagerDashboardComponent } from './manager-dashboard/manager-dashboard.component';
import { FrontRechercheComponent } from './front-recherche/front-recherche.component';
import { LoginEmployeComponent } from './login-employe/login-employe.component';
import { SimpleSearchClientComponent } from './simple-search-client/simple-search-client.component';
import { LoginManagerComponent } from './login-manager/login-manager.component';

export const routes: Routes = [
    {
        path: '',
        component: FrontComponent,
        children: [
            {
                path: '', component: FrontWrapper1Component
            },
            {
                path: 'services', component: FrontWrapper1Component,
            },
            {
                path: 'employes', component: FrontEmployeComponent,
            },
            {
                path: 'favoris', component: FrontFavorisComponent
            },
            {
                path: 'offresSpeciales', component: FrontWrapper2Component
            },
            {
                path: 'recherches', component: FrontRechercheComponent
            }, {

                path: 'simple_search', component: SimpleSearchClientComponent
            },
            {
                path: 'historique', component: FrontHistoriqueComponent
            }

        ]
    },

    {
        path: 'employe',
        component: EmployeComponent,
        children: [

            {
                path: 'calendar', component: EmployeCalendarComponent
            },
            {
                path: 'profil', component: EmployeProfilComponent
            }
        ]
    },

    {
        path: 'manager',
        component: ManagerComponent,
        children: [
            {
                path: 'personnel', component: ManagerPersonnelComponent
            },
            {
                path: 'service', component: ManagerServiceComponent
            },
            {
                path: 'dashboard', component: ManagerDashboardComponent
            }
        ]
    },


    { path: 'login', component: LoginComponent },
    { path: 'manager/login', component: LoginManagerComponent},
    { path: 'employe', component: EmployeComponent },
    { path: 'employe/login', component: LoginEmployeComponent }


];
